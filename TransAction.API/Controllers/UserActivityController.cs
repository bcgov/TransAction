using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using TransAction.Data.Models;

namespace TransAction.API.Controllers
{
    [Route("api/useractivity")]
    public class UserActivityController : BaseController
    {

        public UserActivityController(IHttpContextAccessor httpContextAccessor, ILogger<UserActivityController> logger) :
            base(httpContextAccessor, logger)
        { }

        [HttpGet()]
        public IActionResult GetUserActivity(int page = 1, int pageSize = 25)
        {
            var userActivity = _unitOfWork.UserAct.GetAllUserActivities(page, pageSize);
            var getUserActivities = _mapper.Map<IEnumerable<UserActivityDto>>(userActivity);
            return Ok(getUserActivities);

        }

        [HttpGet("{id}", Name = "GetThatUserActivity")]
        public IActionResult GetUserActivityById(int id)
        {
            try
            {
                var getUserActivity = _unitOfWork.UserAct.GetUserActivity(id);

                if (getUserActivity == null)
                {
                    return NotFound();
                }
                var getUserResult = _mapper.Map<UserActivityDto>(getUserActivity);
                return Ok(getUserResult);

            }

            catch (Exception)
            {
                return StatusCode(500, "A problem happened while handeling your request");
            }

        }

        [HttpPost()]
        public IActionResult CreateUserActivity([FromBody] UserActivityCreateDto createUserActivity)
        {
            if (createUserActivity == null)
            {
                return BadRequest();
            }
            //making sure the user enters atleast 15 mins
            if (createUserActivity.Minutes < 15)
            {
                return BadRequest();
            }
            if (createUserActivity.Name == null || createUserActivity.Description == null)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newUserActivity = _mapper.Map<TraUserActivity>(createUserActivity);

            _unitOfWork.UserAct.Create(newUserActivity);

            if (!_unitOfWork.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var createdUserToReturn = _mapper.Map<UserActivityDto>(newUserActivity);
            return CreatedAtRoute("GetThatUserActivity", new { id = createdUserToReturn.UserId }, createdUserToReturn);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateUserActivity(int id, [FromBody] UserActivityUpdateDto updateUserActivity)
        {
            var userActivityEntity = _unitOfWork.UserAct.GetUserActivity(id);
            if (userActivityEntity == null) return NotFound();
            if (updateUserActivity == null) return NotFound();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _mapper.Map(updateUserActivity, userActivityEntity);

            if (!_unitOfWork.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
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
            return Ok(result);

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
            return Ok(result);
        }

        [HttpGet("team/{teamId}/event/{eventId}")]
        public IActionResult TeamEventSpecificScore(int teamId, int eventId)
        {
            var score = _unitOfWork.UserAct.TeamEventSpecificScore(teamId, eventId);
            var result = new TeamSpecificScoreDto
            {
                EventId = eventId,
                TeamId = teamId,
                Score = score
            };
            return Ok(result);
        }

        [HttpGet("team/{teamId}")]
        public IActionResult TeamSpecificScore(int teamId)
        {
            var score = _unitOfWork.UserAct.TeamSpecificScore(teamId);
            return Ok(score);
        }



        [HttpGet("user/{userId}")]
        public IActionResult CurrentUserScore(int userId)
        {
            var result = _unitOfWork.UserAct.CurrentUserScore(userId);
            return Ok(result);
        }

        [HttpGet("event/{eventId}/top/{number}")]
        public IActionResult TopTeams(int number, int eventId)
        {
            var result = _unitOfWork.UserAct.TopTeams(number, eventId);

            return Ok(result);
        }

        [HttpGet("event/{eventId}/region")]
        public IActionResult RegionScore(int eventId)
        {

            var result = _unitOfWork.UserAct.RegionalScore(eventId);

            return Ok(result);
        }
    }
}