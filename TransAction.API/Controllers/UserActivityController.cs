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

namespace TransAction.API.Controllers
{
    [Route("api/useractivity")]
    public class UserActivityController : BaseController
    {

        public UserActivityController(IHttpContextAccessor httpContextAccessor, ILogger<ActivityController> logger, IUnitOfWork unitOfWork, IMapper mapper) :
            base(httpContextAccessor, logger, unitOfWork, mapper)
        { }

        [HttpGet()]
        public IActionResult GetUserActivity(int page = 1, int pageSize = 25)
        {
            var userActivity = _unitOfWork.UserAct.GetAllUserActivities(page, pageSize);
            var getUserActivities = _mapper.Map<IEnumerable<UserActivityDto>>(userActivity);
            return StatusCode(200, new TransActionPagedResponse(getUserActivities, page, pageSize, _unitOfWork.UserAct.Count()));

        }

        [HttpGet("{id}", Name = "GetThatUserActivity")]
        public IActionResult GetUserActivityById(int id)
        {
            try
            {
                var getUserActivity = _unitOfWork.UserAct.GetUserActivity(id);

                if (getUserActivity == null)
                {
                    return StatusCode(404, new TransActionResponse("User Activity not found"));
                }
                var getUserResult = _mapper.Map<UserActivityDto>(getUserActivity);
                return StatusCode(200, new TransActionResponse(getUserActivity));

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
            if (!ModelState.IsValid)
            {
                return BadRequest(new TransActionResponse(ModelState));
            }

            var newUserActivity = _mapper.Map<TraUserActivity>(createUserActivity);

            _unitOfWork.UserAct.Create(newUserActivity);

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
            if (!ModelState.IsValid)
            {
                return BadRequest(new TransActionResponse(ModelState));
            }

            var userActivityEntity = _unitOfWork.UserAct.GetUserActivity(id);
            if (userActivityEntity == null) return StatusCode(404, new TransActionResponse("User Activity Not Found"));

            _mapper.Map(updateUserActivity, userActivityEntity);

            if (!_unitOfWork.Save())
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request."));
            }

            return GetUserActivityById(id);
        }


        [HttpGet("event/{eventId}")]
        public IActionResult EventSpecificScore(int eventId)
        {
            var score = _unitOfWork.UserAct.EventSpecificScore(eventId);

            var result = new EventSpecificScoreDto
            {
                EventId = eventId,
                Score = score
            };
            return StatusCode(200, new TransActionResponse(result));

        }

        [HttpGet("user/{userId}/event/{eventId}")]
        public IActionResult UserSpecificScore(int userId, int eventId)
        {
            var score = _unitOfWork.UserAct.UserSpecificScore(userId, eventId);
            var result = new UserScoreDto
            {
                EventId = eventId,
                UserId = userId,
                Score = score
            };
            return StatusCode(200, new TransActionResponse(result));
        }

        [HttpGet("team/{teamId}/event/{eventId}")]
        public IActionResult TeamEventSpecificScore(int teamId, int eventId)
        {
            var users = _unitOfWork.User.GetByTeamId(teamId);
            var score = _unitOfWork.UserAct.TeamEventSpecificScore(users, teamId, eventId);
            var result = new TeamSpecificScoreDto
            {
                EventId = eventId,
                TeamId = teamId,
                Score = score
            };
            return StatusCode(200, new TransActionResponse(result));
        }

        [HttpGet("team/{teamId}")]
        public IActionResult TeamSpecificScore(int teamId)
        {
            var users = _unitOfWork.User.GetByTeamId(teamId);
            var score = _unitOfWork.UserAct.TeamSpecificScore(users, teamId);
            return StatusCode(200, new TransActionResponse(score));
        }



        [HttpGet("user/{userId}")]
        public IActionResult CurrentUserScore(int userId)
        {
            var result = _unitOfWork.UserAct.CurrentUserScore(userId);
            return StatusCode(200, new TransActionResponse(result));
        }

        [HttpGet("event/{eventId}/top/{number}")]
        public IActionResult TopTeams(int number, int eventId)
        {
            var result = _unitOfWork.UserAct.TopTeams(number, eventId);

            return StatusCode(200, new TransActionResponse(result));
        }

        [HttpGet("event/{eventId}/region")]
        public IActionResult RegionScore(int eventId)
        {

            var result = _unitOfWork.UserAct.RegionalScore(eventId);

            return StatusCode(200, new TransActionResponse(result));
        }
    }
}