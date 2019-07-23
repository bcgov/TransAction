using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using TransAction.API.Authorization;
using TransAction.Data.Models;
using TransAction.Data.Repositories.Interfaces;
using AutoMapper;
using TransAction.API.Responses;

namespace TransAction.API.Controllers
{
    [Route("api/roles")]
    public class RoleController : BaseController
    {

        public RoleController(IHttpContextAccessor httpContextAccessor, ILogger<ActivityController> logger, IUnitOfWork unitOfWork, IMapper mapper) :
            base(httpContextAccessor, logger, unitOfWork, mapper)
        { }

        [HttpGet()]
        public IActionResult GetRoles(int page = 1, int pageSize = 25)
        {
            var roles = _unitOfWork.Role.GetAllRoles(page, pageSize);
            var getRoles = _mapper.Map<IEnumerable<RoleDto>>(roles);
            return StatusCode(200, new TransActionPagedResponse(getRoles, page, pageSize, _unitOfWork.Role.Count()));

        }

        [HttpGet("{id}", Name = "GetRole")]
        public IActionResult GetRoleById(int id)
        {
            try
            {
                var getRole = _unitOfWork.Role.GetRoleById(id);

                if (getRole == null)
                {
                    return StatusCode(404, new TransActionResponse("Role Not Found"));
                }
                var getRoleResult = _mapper.Map<RoleDto>(getRole);
                return StatusCode(200, new TransActionResponse(getRoleResult));

            }

            catch (Exception)
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request"));
            }

        }

        [ClaimRequirement(AuthorizationTypes.ADMIN_CLAIM)]
        [HttpPost()]
        public IActionResult CreateRole([FromBody] RoleCreateDto createRole)
        {
            if (createRole == null)
            {
                return BadRequest(new TransActionResponse("No Role entered."));
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(new TransActionResponse(ModelState));
            }
            if (_unitOfWork.Role.RoleExists(createRole.Name))
            {
                return BadRequest(new TransActionResponse("Role Already exists"));
            }

            var newRole = _mapper.Map<TraRole>(createRole);


            _unitOfWork.Role.Create(newRole);

            if (!_unitOfWork.Save())
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request."));
            }

            var createRoleResult = _mapper.Map<RoleDto>(newRole);
            return CreatedAtRoute("GetRole", new { id = createRoleResult.RoleId }, new TransActionResponse(createRoleResult));


        }

        [ClaimRequirement(AuthorizationTypes.ADMIN_CLAIM)]
        [HttpPut("{id}")]
        public IActionResult UpdateRole(int id, [FromBody] RoleUpdateDto updateRole)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new TransActionResponse(ModelState));
            }
            var roleEntity = _unitOfWork.Role.GetRoleById(id);
            if (roleEntity == null) return StatusCode(404, new TransActionResponse("Role Not Found"));

            _mapper.Map(updateRole, roleEntity);
            _unitOfWork.Role.Update(roleEntity);


            if (!_unitOfWork.Save())
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request."));
            }

            return StatusCode(StatusCodes.Status204NoContent, new TransActionResponse());
        }
    }
}