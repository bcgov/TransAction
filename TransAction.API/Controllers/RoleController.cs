using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TransAction.API.Authorization;
using TransAction.Data.Models;
using TransAction.Data.Services;

namespace TransAction.API.Controllers
{
    [Route("api/roles")]
    public class RoleController : Controller
    {
        private ITransActionRepo _transActionRepo;
        public RoleController(ITransActionRepo transActionRepo)
        {
            _transActionRepo = transActionRepo;
        }

        [HttpGet()]
        public IActionResult GetRoles()
        {
            var roles = _transActionRepo.GetRoles();
            var getRoles = Mapper.Map<IEnumerable<RoleDto>>(roles);
            return Ok(getRoles);

        }

        [HttpGet("{id}", Name = "GetThatRole")]
        public IActionResult GetRole(int id)
        {
            try
            {
                var getRoles = _transActionRepo.GetRoles().FirstOrDefault(c => c.RoleId == id);

                if (getRoles == null)
                {
                    return NotFound();
                }
                var getRole = _transActionRepo.GetRole(id);
                var getRoleResult = Mapper.Map<RoleDto>(getRole);
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
            if (_transActionRepo.RoleExists(createRole.Name))
            {
                return BadRequest();
            }

            var newRole = Mapper.Map<TraRole>(createRole);


            _transActionRepo.CreateRole(newRole);

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var createdPointOfInterestToReturn = Mapper.Map<RoleDto>(newRole);
            return CreatedAtRoute("GetThatRole", new { id = createdPointOfInterestToReturn.RoleId }, createdPointOfInterestToReturn);


        }

        [ClaimRequirement(AuthorizationTypes.ADMIN_CLAIM)]
        [HttpPut("{id}")]
        public IActionResult RoleUpdate(int id, [FromBody] RoleUpdateDto updateRole)
        {
            var roleEntity = _transActionRepo.GetRole(id);
            if (roleEntity == null) return NotFound();
            if (updateRole == null) return NotFound();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            Mapper.Map(updateRole, roleEntity);


            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            return NoContent();
        }
    }
}