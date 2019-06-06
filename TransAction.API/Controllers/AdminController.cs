using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TransAction.API.Authorization;
using TransAction.Data.Models;
using TransAction.Data.Services;

namespace TransAction.API.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly ITransActionRepo _transActionRepo;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMapper _mapper;

        public AdminController(ITransActionRepo transActionRepo, IHttpContextAccessor httpContextAccessor, IMapper mapper)
        {
            _transActionRepo = transActionRepo;
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
        }

        [ClaimRequirement(AuthorizationTypes.ADMIN_CLAIM)]
        [HttpPost("user/role")]
        public IActionResult UpdateUserRole([FromBody] UserRoleUpdateDto userRoleUpdate)
        {
            var user = _transActionRepo.GetUser(userRoleUpdate.UserId);
            if (user == null)
                return NotFound("User not found");

            var role = _transActionRepo.GetRole(userRoleUpdate.RoleId);
            if (role == null)
                return NotFound("Role not found");

            user.RoleId = role.RoleId;

            if (!_transActionRepo.Save())
                return StatusCode(500, "Error occurred while updating user role");

            return CreatedAtRoute("GetUser", new { controller = "user", id = user.UserId }, _mapper.Map<UserDto>(user));
        }
    }
}