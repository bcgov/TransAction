using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using TransAction.API.Authorization;
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
        [HttpPost("user/role")]
        public IActionResult UpdateUserRole([FromBody] UserRoleUpdateDto userRoleUpdate)
        {
            var user = _unitOfWork.User.GetById(userRoleUpdate.UserId);
            if (user == null)
                return NotFound("User not found");

            var role = _unitOfWork.Role.GetRoleById(userRoleUpdate.RoleId);
            if (role == null)
                return NotFound("Role not found");

            user.RoleId = role.RoleId;

            _unitOfWork.User.Update(user);
            if (!_unitOfWork.Save())
                return StatusCode(500, "Error occurred while updating user role");

            return CreatedAtRoute("GetUser", new { controller = "user", id = user.UserId }, _mapper.Map<UserDto>(user));
        }
    }
}