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
        public IActionResult GetActivities()
        {
            var activities = _transActionRepo.GetActivities();
            var getActivities = Mapper.Map<IEnumerable<ActivityDto>>(activities);
            return Ok(getActivities);

        }


        [HttpGet("{id}", Name = "GetThatActivity")]
        public IActionResult GetActivity(int id)
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

        [HttpPost()]
        public IActionResult CreateActivity([FromBody] ActivityCreateDto createActivity)
        {
            if (createActivity == null)
            {
                return BadRequest();
            }
            if (createActivity.Description == null || createActivity.Name == null)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (_transActionRepo.ActivityExists(createActivity.Name))
            {
                return BadRequest();
            }

            var newActivity = Mapper.Map<TraActivity>(createActivity);


            _transActionRepo.CreateActivity(newActivity);

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var createdPointOfInterestToReturn = Mapper.Map<ActivityDto>(newActivity);
            return CreatedAtRoute("GetThatActivity", new { id = createdPointOfInterestToReturn.ActivityId }, createdPointOfInterestToReturn);


        }

        [HttpPut("{id}")]
        public IActionResult ActivityUpdate(int id, [FromBody] ActivityUpdateDto updateActivity)
        {
            var activityEntity = _transActionRepo.GetActivity(id);
            if (activityEntity == null) return NotFound();
            if (updateActivity == null) return NotFound();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            Mapper.Map(updateActivity, activityEntity);


            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            return NoContent();
        }

    }
}