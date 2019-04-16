using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TransAction.Data.Models;
using TransAction.Data.Services;

namespace TransAction.API.Controllers
{
    [Route("api/activities")]
    public class ActivityController : Controller
    {
        private ITransActionRepo _transActionRepo;
        public ActivityController(ITransActionRepo transActionRepo, IHttpContextAccessor httpContextAccessor)
        {
            _transActionRepo = transActionRepo;         
        }

        [HttpGet()]
        public IActionResult GetActivity()
        {
            var activities = _transActionRepo.GetActivities();
            var getActivities = Mapper.Map<IEnumerable<ActivityDto>>(activities);
            return Ok(getActivities);

        }


        [HttpGet("{id}", Name = "GetThatActivity")]
        public IActionResult GetActivities(int id)
        {
            try
            {
                var getActivities = _transActionRepo.GetActivities().FirstOrDefault(c => c.ActivityId == id);

                if (getActivities == null)
                {
                    return NotFound();
                }
                var getActivity = _transActionRepo.GetActivity(id);
                var getActivityResult = Mapper.Map<ActivityDto>(getActivity);
                return Ok(getActivityResult);

            }

            catch (Exception)
            {
                return StatusCode(500, "A problem happened while handeling your request");
            }

        }

    }
}