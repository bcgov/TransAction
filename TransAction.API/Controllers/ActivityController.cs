using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using TransAction.API.Helpers;
using TransAction.Data.Models;

namespace TransAction.API.Controllers
{
    [Route("api/activities")]
    public class ActivityController : BaseController
    {

        public ActivityController(IHttpContextAccessor httpContextAccessor, ILogger<ActivityController> logger) :
            base(httpContextAccessor, logger)
        { }

        [HttpGet()]
        public IActionResult GetActivities()
        {
            var activities = _transActionRepo.GetActivities();
            var getActivities = _mapper.Map<IEnumerable<ActivityDto>>(activities);
            return Ok(getActivities);

        }


        [HttpGet("{id}", Name = "GetActivity")]
        public IActionResult GetActivityById(int id)
        {
            try
            {
                var getActivities = _transActionRepo.GetActivities().FirstOrDefault(c => c.ActivityId == id);

                if (getActivities == null)
                {
                    return NotFound();
                }
                var getActivity = _transActionRepo.GetActivity(id);
                var getActivityResult = _mapper.Map<ActivityDto>(getActivity);
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
            string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            // var getUser = _transActionRepo.GetUsers().FirstOrDefault(c => c.Guid == userGuid);
            var getUser = _unitOfWork.User.GetByGuid(userGuid);
            if (getUser.TeamId == null)
            {
                return BadRequest();
            }


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

            var newActivity = _mapper.Map<TraActivity>(createActivity);


            _transActionRepo.CreateActivity(newActivity);

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var createActivityResult = _mapper.Map<ActivityDto>(newActivity);
            return CreatedAtRoute("GetActivity", new { id = createActivityResult.ActivityId }, createActivityResult);


        }

        [HttpPut("{id}")]
        public IActionResult UpdateActivity(int id, [FromBody] ActivityUpdateDto updateActivity)
        {
            string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            var getUser = _unitOfWork.User.GetByGuid(userGuid);
            if (getUser.TeamId == null)
            {
                return BadRequest();
            }

            var activityEntity = _transActionRepo.GetActivity(id);
            if (activityEntity == null) return NotFound();
            if (updateActivity == null) return NotFound();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _mapper.Map(updateActivity, activityEntity);


            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            return NoContent();
        }

    }
}