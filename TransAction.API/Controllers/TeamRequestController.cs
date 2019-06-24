using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using TransAction.Data.Models;

namespace TransAction.API.Controllers
{
    [Route("api/teamrequests")]
    public class TeamRequestController : BaseController
    {

        public TeamRequestController(IHttpContextAccessor httpContextAccessor, ILogger<TeamRequestController> logger) :
            base(httpContextAccessor, logger)
        { }

        [HttpGet()]
        public IActionResult GetRequests()
        {
            var request = _transActionRepo.GetRequests();
            var getRequest = _mapper.Map<IEnumerable<MemberReqDto>>(request);
            return Ok(getRequest);
        }

        [HttpGet("{id}", Name = "GetThatMemberReq")]
        public IActionResult GetUserActivityById(int id)
        {
            try
            {
                var getMemberRequest = _transActionRepo.GetRequests().FirstOrDefault(c => c.MemberReqId == id);

                if (getMemberRequest == null)
                {
                    return NotFound();
                }
                var getRequest = _transActionRepo.GetRequest(id);
                var getUserResult = _mapper.Map<MemberReqDto>(getRequest);
                return Ok(getUserResult);

            }

            catch (Exception)
            {
                return StatusCode(500, "A problem happened while handeling your request");
            }

        }

        [HttpPost()]
        public IActionResult CreateRequest([FromBody] MemberReqCreateDto createRequest)
        {

            if (createRequest == null)
            {
                return BadRequest();
            }

            //takes care of the fact the if the user is on team then he cant create a request.
            var user = createRequest.UserId;
            var getUser = _transActionRepo.GetUser(user);
            if (getUser.TeamId != null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newRequest = _mapper.Map<TraMemberReq>(createRequest);
            newRequest.IsActive = true;

            _transActionRepo.CreateRequest(newRequest);

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var createdPointOfInterestToReturn = _mapper.Map<MemberReqDto>(newRequest);
            return CreatedAtRoute("GetThatEvent", new { id = createdPointOfInterestToReturn.MemberReqId }, createdPointOfInterestToReturn);


        }

        [HttpPut("{id}")]
        public IActionResult UpdateRequest(int id, [FromBody] MemberReqUpdateDto updateRequest)
        {
            var requestEntity = _transActionRepo.GetRequest(id);
            if (requestEntity == null) return NotFound();
            if (updateRequest == null) return NotFound();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _mapper.Map(updateRequest, requestEntity);


            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            return NoContent();
        }

        [HttpGet("team/{teamId}")]
        public IActionResult CurrentTeamRequests(int teamId)
        {
            var result = _transActionRepo.CurrentTeamReq(teamId);
            return Ok(result);
        }
    }
}