using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using TransAction.API.Authorization;
using TransAction.API.Responses;
using TransAction.Data.Models;
using TransAction.Data.Repositories.Interfaces;

namespace TransAction.API.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminController : BaseController
    {

        public AdminController(IHttpContextAccessor httpContextAccessor, ILogger<ActivityController> logger, IUnitOfWork unitOfWork, IMapper mapper) :
            base(httpContextAccessor, logger, unitOfWork, mapper)
        { }

        [ClaimRequirement(AuthorizationTypes.ADMIN_CLAIM)]
        [HttpPut("users/{userId}/role")]
        public IActionResult UpdateUserRole(int userId, [FromBody] UserRoleUpdateDto userRoleUpdate)
        {
            var user = _unitOfWork.User.GetById(userId);
            user.TraImage = null;
            user.Role = null;
            if (user == null)
                return StatusCode(404, new TransActionResponse("User not found."));

            var role = _unitOfWork.Role.GetRoleById(userRoleUpdate.RoleId);
            if (role == null)
                return StatusCode(404, new TransActionResponse("Role not found"));

            user.RoleId = role.RoleId;

            // Make sure the user can't revoke his own admin role if he is the only admin
            var adminRole = _unitOfWork.Role.GetAllRoles().Where(x => x.Name.ToLower() == "admin").FirstOrDefault();
            var adminUsers = _unitOfWork.User.GetAdmins(adminRole.RoleId);

            if (role != adminRole && adminUsers.Count() == 1 && user == adminUsers.FirstOrDefault())
            {
                return StatusCode(400, new TransActionResponse("Cannot change the only admin's role"));
            }

            _unitOfWork.User.Update(user);
            if (!_unitOfWork.Save())
                return StatusCode(500, new TransActionResponse("Error occurred while updating user role"));

            return CreatedAtRoute("GetUser", new { controller = "user", id = user.UserId }, _mapper.Map<UserDto>(user));
        }

        [ClaimRequirement(AuthorizationTypes.ADMIN_CLAIM)]
        [HttpGet("users")]
        public IActionResult GetAdminUsers()
        {
            var adminRole = _unitOfWork.Role.GetAllRoles().Where(x => x.Name.ToLower() == "admin").FirstOrDefault();
            if (adminRole == null)
                return StatusCode(404, new TransActionResponse("Role not found"));

            var users = _unitOfWork.User.GetAdmins(adminRole.RoleId);

            return Ok(new TransActionResponse(_mapper.Map<IEnumerable<UserDto>>(users)));
        }
    }
}