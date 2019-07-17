using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using TransAction.API.Helpers;
using TransAction.Data.Models;
using TransAction.Data.Repositories.Interfaces;
using AutoMapper;
using TransAction.API.Responses;

namespace TransAction.API.Controllers
{
    [Route("api/activities")]
    public class ActivityController : BaseController
    {

        public ActivityController(IHttpContextAccessor httpContextAccessor, ILogger<ActivityController> logger, IUnitOfWork unitOfWork, IMapper mapper) :
            base(httpContextAccessor, logger, unitOfWork, mapper)
        { }

        [HttpGet()]
        public IActionResult GetActivities(int page = 1, int pageSize = 25)
        {
            var activities = _unitOfWork.Activity.GetAll(page, pageSize);
            var getActivities = _mapper.Map<IEnumerable<ActivityDto>>(activities);
            int count = _unitOfWork.Activity.GetCount();
            return StatusCode(200, new TransActionPagedResponse(getActivities, page, pageSize, count));

        }


        [HttpGet("{id}", Name = "GetActivity")]
        public IActionResult GetActivityById(int id)
        {
            try
            {
                var getActivity = _unitOfWork.Activity.GetById(id);

                if (getActivity == null)
                {
                    return NotFound();
                }
                var getActivityResult = _mapper.Map<ActivityDto>(getActivity);
                return StatusCode(200, new TransActionResponse(getActivityResult));

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
                return BadRequest(new TransActionResponse("No user Activity entry entered."));
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(new TransActionResponse(ModelState.ToString()));
            }
            if (_unitOfWork.Activity.ActivityExists(createActivity.Name))
            {
                return BadRequest(new TransActionResponse("Activity already exists."));
            }

            var newActivity = _mapper.Map<TraActivity>(createActivity);


            _unitOfWork.Activity.Create(newActivity);

            if (!_unitOfWork.Save())
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request."));
                // return StatusCode(500, "A problem happened while handling your request.");
            }

            var createActivityResult = _mapper.Map<ActivityDto>(newActivity);
            return CreatedAtRoute("GetActivity", new { id = createActivityResult.ActivityId }, new TransActionResponse(createActivity));


        }

        [HttpPut("{id}")]
        public IActionResult UpdateActivity(int id, [FromBody] ActivityUpdateDto updateActivity)
        {
            string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            var getUser = _unitOfWork.User.GetByGuid(userGuid);
            if (getUser.TeamId == null)
            {
                return BadRequest(new TransActionResponse("User is not in a team."));
            }

            var activityEntity = _unitOfWork.Activity.GetById(id);
            if (activityEntity == null) return NotFound();
            if (updateActivity == null) return NotFound();

            if (!ModelState.IsValid)
            {
                return BadRequest(new TransActionResponse(ModelState));
            }
            _mapper.Map(updateActivity, activityEntity);
            _unitOfWork.Activity.Update(activityEntity);

            if (!!_unitOfWork.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            return NoContent();
        }

    }
}