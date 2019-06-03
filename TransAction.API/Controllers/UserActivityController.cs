﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TransAction.API.Helpers;
using TransAction.Data.Models;
using TransAction.Data.Services;

namespace TransAction.API.Controllers
{
    [Route("api/useractivity")]
    public class UserActivityController : Controller
    {
        private readonly ITransActionRepo _transActionRepo;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMapper _mapper;

        public UserActivityController(ITransActionRepo transActionRepo, IHttpContextAccessor httpContextAccessor, IMapper mapper)
        {
            _transActionRepo = transActionRepo;
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
        }

        [HttpGet()]
        public IActionResult GetUserActivity()
        {
            var userActivity = _transActionRepo.GetUserActivities();
            var getUserActivities = _mapper.Map<IEnumerable<UserActivityDto>>(userActivity);
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
            if(createUserActivity.Minutes < 15)
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
            //if (_transActionRepo.UserActivityExists(createUserActivity.Name))
            //{
            //    return BadRequest();
            //}
                                   
            var newUserActivity = _mapper.Map<TraUserActivity>(createUserActivity);

            _transActionRepo.CreateUserActivity(newUserActivity);

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var createdUserToReturn = _mapper.Map<UserActivityDto>(newUserActivity);
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

            _mapper.Map(updateUserActivity, userActivityEntity);

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            return GetUserActivity(id);
        }

        //total score for that specific team for that specific event

       [HttpGet("event/{eventId}")]
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

        [HttpGet("user/{userId}/event/{eventId}")]
        public IActionResult UserSpecificScore(int userId, int eventId)
        {
            var score = _transActionRepo.UserSpecificScore(userId, eventId);
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
            var score = _transActionRepo.TeamEventSpecificScore(teamId, eventId);
            var result = new TeamSpecificScoreDto
            {
                eventId = eventId,
                teamId = teamId,
                score = score
            };
            return Ok(result);
        }

        [HttpGet("team/{teamId}")]
        public IActionResult TeamSpecificScore(int teamId)
        {
            var score = _transActionRepo.TeamSpecificScore(teamId);            
            return Ok(score);
        }



        [HttpGet("user/{userId}")]
        public IActionResult CurrentUserScore(int userId)
        {
            var result = _transActionRepo.CurrentUserScore(userId);
            return Ok(result);
        }

        [HttpGet("event/{eventId}/top/{number}")]
        public IActionResult TopTeams(int number, int eventId)
        {
            var result = _transActionRepo.TopTeams(number, eventId);

            return Ok(result);
        }

        [HttpGet("event/{eventId}/region")]
        public IActionResult RegionScore(int eventId){
          
            var result = _transActionRepo.RegionalScore(eventId);

            return Ok(result);
        }
    }
}