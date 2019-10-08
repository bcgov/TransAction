using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using TransAction.Data.Models;
using TransAction.Data.Repositories.Interfaces;
using AutoMapper;
using TransAction.API.Responses;
using TransAction.API.Authorization;
using TransAction.API.Helpers;

namespace TransAction.API.Controllers
{
    [Route("api/useractivities")]
    public class UserActivityController : BaseController
    {

        public UserActivityController(IHttpContextAccessor httpContextAccessor, ILogger<ActivityController> logger, IUnitOfWork unitOfWork, IMapper mapper) :
            base(httpContextAccessor, logger, unitOfWork, mapper)
        { }

        [ClaimRequirement(AuthorizationTypes.ADMIN_CLAIM)]
        [HttpGet()]
        public IActionResult GetUserActivity(int page = 1, int pageSize = 25)
        {
            var userActivity = _unitOfWork.UserActivity.GetAll(page, pageSize);
            var getUserActivities = _mapper.Map<IEnumerable<UserActivityDto>>(userActivity);
            return StatusCode(200, new TransActionPagedResponse(getUserActivities, page, pageSize, _unitOfWork.UserActivity.Count()));

        }

        [HttpGet("event/{eventId}/user/{userId}")]
        public IActionResult GetUserActivityByEventUser(int eventId, int userId)
        {
            string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            var user = _unitOfWork.User.GetByGuid(userGuid);
            if (user.Role.Name.ToLower() != "admin" && user.UserId != userId)
            {
                return BadRequest(new TransActionResponse("Unauthorized user"));
            }

            var userActivities = _unitOfWork.UserActivity.GetAllByEventUser(eventId, userId);
            return StatusCode(200, new TransActionResponse(_mapper.Map<IEnumerable<UserActivityDto>>(userActivities)));
        }

        [HttpGet("{id}", Name = "GetThatUserActivity")]
        public IActionResult GetUserActivityById(int id)
        {
            try
            {
                var getUserActivity = _unitOfWork.UserActivity.GetUserActivity(id);

                if (getUserActivity == null)
                {
                    return StatusCode(404, new TransActionResponse("User Activity not found"));
                }
                var getUserResult = _mapper.Map<UserActivityDto>(getUserActivity);
                return StatusCode(200, new TransActionResponse(getUserResult));

            }

            catch (Exception)
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request"));
            }

        }

        [HttpPost()]
        public IActionResult CreateUserActivity([FromBody] UserActivityCreateDto createUserActivity)
        {
            if (createUserActivity == null)
            {
                return BadRequest(new TransActionResponse("User Activity not entered"));
            }
            //making sure the user enters atleast 15 mins
            if (createUserActivity.Minutes < 15)
            {
                return BadRequest(new TransActionResponse("Minutes should be more then 15"));
            }

            var activityType = _unitOfWork.Activity.GetById(createUserActivity.ActivityId);
            if (activityType == null)
                return NotFound(new TransActionResponse("Activity type not found"));

            if (activityType.Name != "Other" && string.IsNullOrEmpty(createUserActivity.Description))
            {
                createUserActivity.Description = activityType.Description;
                createUserActivity.Name = activityType.Description;
            }

            ModelState.Clear();
            TryValidateModel(createUserActivity);

            if (!ModelState.IsValid)
            {
                return BadRequest(new TransActionResponse(ModelState));
            }

            var eventEntity = _unitOfWork.Event.GetById(createUserActivity.EventId);

            if (eventEntity == null)
                return NotFound(new TransActionResponse("Event not found"));

            if (!eventEntity.IsActive.Value)
                return NotFound(new TransActionResponse("Event not active"));

            if (createUserActivity.ActivityTimestamp < eventEntity.StartDate || createUserActivity.ActivityTimestamp > eventEntity.EndDate)
                return BadRequest(new TransActionResponse("Activity time is outside of event start and end date"));

            var newUserActivity = _mapper.Map<TraUserActivity>(createUserActivity);

            _unitOfWork.UserActivity.Create(newUserActivity);

            if (!_unitOfWork.Save())
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request."));
            }

            var createdUserToReturn = _mapper.Map<UserActivityDto>(newUserActivity);
            return CreatedAtRoute("GetThatUserActivity", new { id = createdUserToReturn.UserId }, new TransActionResponse(createdUserToReturn));
        }

        [HttpPut("{id}")]
        public IActionResult UpdateUserActivity(int id, [FromBody] UserActivityUpdateDto updateUserActivity)
        {
            //making sure the user enters atleast 15 mins
            if (updateUserActivity.Minutes < 15)
            {
                return BadRequest(new TransActionResponse("Minutes should be more then 15"));
            }

            var activityType = _unitOfWork.Activity.GetById(updateUserActivity.ActivityId);
            if (activityType == null)
                return NotFound(new TransActionResponse("Activity type not found"));

            if (activityType.Name != "Other" && string.IsNullOrEmpty(updateUserActivity.Description))
            {
                updateUserActivity.Description = activityType.Description;
                updateUserActivity.Name = activityType.Description;
            }

            ModelState.Clear();
            TryValidateModel(updateUserActivity);

            if (!ModelState.IsValid)
            {
                return BadRequest(new TransActionResponse(ModelState));
            }

            string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            var getUser = _unitOfWork.User.GetByGuid(userGuid);

            if (getUser.UserId != updateUserActivity.UserId)
                return BadRequest(new TransActionResponse("Not allowed to edit resource."));

            var userActivityEntity = _unitOfWork.UserActivity.GetUserActivity(id);
            if (userActivityEntity == null) return StatusCode(404, new TransActionResponse("User Activity Not Found"));

            var eventEntity = _unitOfWork.Event.GetById(updateUserActivity.EventId);

            if (eventEntity == null)
                return NotFound(new TransActionResponse("Event not found"));

            if (!eventEntity.IsActive.Value)
                return NotFound(new TransActionResponse("Event not active"));

            if (updateUserActivity.ActivityTimestamp < eventEntity.StartDate || updateUserActivity.ActivityTimestamp > eventEntity.EndDate)
                return BadRequest(new TransActionResponse("Activity time is outside of event start and end date"));

            _mapper.Map(updateUserActivity, userActivityEntity);

            if (!_unitOfWork.Save())
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request."));
            }

            return GetUserActivityById(id);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteUserActivity(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new TransActionResponse(ModelState));
            }

            var userActivityEntity = _unitOfWork.UserActivity.GetUserActivity(id);
            if (userActivityEntity == null) return StatusCode(404, new TransActionResponse("User Activity Not Found"));

            string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            var getUser = _unitOfWork.User.GetByGuid(userGuid);

            if (userActivityEntity.UserId != getUser.UserId)
                return BadRequest(new TransActionResponse("Not allowed to delete resource."));

            _unitOfWork.UserActivity.Delete(userActivityEntity);

            if (!_unitOfWork.Save())
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request."));
            }

            return StatusCode(StatusCodes.Status204NoContent, new TransActionResponse());
        }


        [HttpGet("score/event/{eventId}")]
        public IActionResult EventSpecificScore(int eventId)
        {
            var score = _unitOfWork.UserActivity.EventSpecificScore(eventId);

            var result = new EventSpecificScoreDto
            {
                EventId = eventId,
                Score = score
            };
            return StatusCode(200, new TransActionResponse(result));

        }

        [HttpGet("score/user/{userId}/event/{eventId}")]
        public IActionResult UserSpecificScore(int userId, int eventId)
        {
            var eventEntity = _unitOfWork.Event.GetById(eventId);
            var score = _unitOfWork.UserActivity.UserSpecificScore(userId, eventId);
            var result = new UserScoreDto
            {
                EventId = eventId,
                UserId = userId,
                Score = score,
                EventName = eventEntity.Name
            };
            return StatusCode(200, new TransActionResponse(result));
        }

        [HttpGet("score/team/{teamId}/event/{eventId}")]
        public IActionResult TeamEventSpecificScore(int teamId, int eventId)
        {
            var eventEntity = _unitOfWork.Event.GetById(eventId);
            var users = _unitOfWork.User.GetByTeamId(teamId);
            var score = _unitOfWork.UserActivity.TeamEventSpecificScore(users, teamId, eventId);
            var result = new TeamSpecificScoreDto
            {
                EventId = eventId,
                TeamId = teamId,
                Score = score,
                EventName = eventEntity.Name
            };
            return StatusCode(200, new TransActionResponse(result));
        }

        [HttpGet("score/team/{teamId}")]
        public IActionResult TeamSpecificScore(int teamId)
        {
            var users = _unitOfWork.User.GetByTeamId(teamId);
            var score = _unitOfWork.UserActivity.TeamSpecificScore(users, teamId);
            return StatusCode(200, new TransActionResponse(score));
        }



        [HttpGet("score/user/{userId}")]
        public IActionResult CurrentUserScore(int userId)
        {
            var result = _unitOfWork.UserActivity.CurrentUserScore(userId);
            return StatusCode(200, new TransActionResponse(result));
        }

        [HttpGet("score/event/{eventId}/top/{number}")]
        public IActionResult TopTeams(int number, int eventId)
        {
            var result = _unitOfWork.UserActivity.TopTeams(number, eventId);

            return StatusCode(200, new TransActionResponse(result));
        }

        [HttpGet("score/event/{eventId}/region")]
        public IActionResult RegionScore(int eventId)
        {

            var result = _unitOfWork.UserActivity.RegionalScore(eventId);

            return StatusCode(200, new TransActionResponse(result));
        }
    }
}