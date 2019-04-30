using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
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
    }
}