using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TransAction.Data.Models;
using TransAction.Data.Services;

namespace TransAction.API.Controllers
{
    [Route("api/useractivity")]
    public class UserActivityController : Controller
    {
        private ITransActionRepo _transActionRepo;
        private IHttpContextAccessor _httpContextAccessor;

        public UserActivityController(ITransActionRepo transActionRepo, IHttpContextAccessor httpContextAccessor)
        {
            _transActionRepo = transActionRepo;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet()]
        public IActionResult GetUserActivity()
        {
            var userActivity = _transActionRepo.GetUserActivities();
            var getUserActivities = Mapper.Map<IEnumerable<UserActivityDto>>(userActivity);
            return Ok(getUserActivities);

        }

        [HttpGet("{id}", Name = "GetThatUserActivity")]
        public IActionResult GetUserActivity(int id)
        {
            try
            {
                var getUsersActivity = _transActionRepo.GetUserActivities().FirstOrDefault(c => c.UserActivityId == id);

                if (getUsersActivity == null)
                {
                    return NotFound();
                }
                var getUserActivity = _transActionRepo.GetUserActivity(id);
                var getUserResult = Mapper.Map<UserActivityDto>(getUserActivity);
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

            if (createUserActivity.Name == null || createUserActivity.ActivityId == null || createUserActivity.Description == null || createUserActivity.UserId == null || createUserActivity.Minutes == null)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (_transActionRepo.UserActivityExists(createUserActivity.Name))
            {
                return BadRequest();
            }

            var newUserActivity = Mapper.Map<TraUserActivity>(createUserActivity);

            _transActionRepo.CreateUserActivity(newUserActivity);

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var createdUserToReturn = Mapper.Map<UserActivityDto>(newUserActivity);
            return CreatedAtRoute("GetThatUserActivity", new { id = createdUserToReturn.UserId }, createdUserToReturn);
        }

        [HttpPut("{id}")]
        public IActionResult UserActivityUpdate(int id, [FromBody] UserActivityUpdateDto updateUserActivity)
        {
            var userActivityEntity = _transActionRepo.GetUserActivity(id);
            if (userActivityEntity == null) return NotFound();
            if (updateUserActivity == null) return NotFound();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Mapper.Map(updateUserActivity, userActivityEntity);

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            return NoContent();
        }

        //total score for that specific team for that specific event

       [HttpGet("event{eventId}")]
        public IActionResult EventSpecificScore(int eventId)
        {
            var score = _transActionRepo.EventSpecificScore(eventId);

            var result = new EventSpecificScoreDto
            {
                EventId = eventId,
                Score = score
            };
            return Ok(result);

        }

        [HttpGet("user/{userId}/event{eventId}")]
        public IActionResult UserSpecificScore(int userId, int eventId)
        {
            var score = _transActionRepo.UserSpecificScore(userId, eventId);
            var result = new UserSpecificScoreDto
            {
                eventId = eventId,
                userId = userId,
                score = score
            };
            return Ok(result);
        }

        [HttpGet("team/{teamId}/event{eventId}")]
        public IActionResult TeamSpecificScore(int teamId, int eventId)
        {
            var score = _transActionRepo.TeamSpecificScore(teamId, eventId);
            var result = new TeamSpecificScoreDto
            {
                eventId = eventId,
                teamId = teamId,
                score = score
            };
            return Ok(result);
        }
    }
}