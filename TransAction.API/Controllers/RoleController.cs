using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using TransAction.API.Authorization;
using TransAction.Data.Models;

namespace TransAction.API.Controllers
{
    [Route("api/roles")]
    public class RoleController : BaseController
    {

        public RoleController(IHttpContextAccessor httpContextAccessor, ILogger<RoleController> logger) :
            base(httpContextAccessor, logger)
        { }

        [HttpGet()]
        public IActionResult GetRoles(int page = 1, int pageSize = 25)
        {
            var roles = _unitOfWork.Role.GetAllRoles(page, pageSize);
            var getRoles = _mapper.Map<IEnumerable<RoleDto>>(roles);
            return Ok(getRoles);

        }

        [HttpGet("{id}", Name = "GetRole")]
        public IActionResult GetRoleById(int id)
        {
            try
            {
                var getRole = _unitOfWork.Role.GetRoleById(id);

                if (getRole == null)
                {
                    return NotFound();
                }
                //var getRole = _transActionRepo.GetRole(id);
                var getRoleResult = _mapper.Map<RoleDto>(getRole);
                return Ok(getRoleResult);

            }

            catch (Exception)
            {
                return StatusCode(500, "A problem happened while handeling your request");
            }

        }

        [ClaimRequirement(AuthorizationTypes.ADMIN_CLAIM)]
        [HttpPost()]
        public IActionResult CreateRole([FromBody] RoleCreateDto createRole)
        {
            if (createRole == null)
            {
                return BadRequest();
            }
            if (createRole.Description == null || createRole.Name == null)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (_unitOfWork.Role.RoleExists(createRole.Name))
            {
                return BadRequest();
            }

            var newRole = _mapper.Map<TraRole>(createRole);


            _unitOfWork.Role.Create(newRole);

            if (!_unitOfWork.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var createRoleResult = _mapper.Map<RoleDto>(newRole);
            return CreatedAtRoute("GetRole", new { id = createRoleResult.RoleId }, createRoleResult);


        }

        [ClaimRequirement(AuthorizationTypes.ADMIN_CLAIM)]
        [HttpPut("{id}")]
        public IActionResult UpdateRole(int id, [FromBody] RoleUpdateDto updateRole)
        {
            var roleEntity = _unitOfWork.Role.GetRoleById(id);
            if (roleEntity == null) return NotFound();
            if (updateRole == null) return NotFound();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _mapper.Map(updateRole, roleEntity);
            _unitOfWork.Role.Update(roleEntity);


            if (!_unitOfWork.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            return NoContent();
        }
    }
}