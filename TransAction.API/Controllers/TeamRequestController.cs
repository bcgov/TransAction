using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TransAction.Data.Models;
using TransAction.Data.Services;

namespace TransAction.API.Controllers
{
    [Route("api/teamrequest")]
    public class TeamRequestController : Controller
    {
        private ITransActionRepo _transActionRepo;
        public TeamRequestController(ITransActionRepo transActionRepo)
        {
            _transActionRepo = transActionRepo;
        }

        [HttpGet()]
        public IActionResult GetRequests()
        {
            var request = _transActionRepo.GetRequests();
            var getRequest = Mapper.Map<IEnumerable<MemberReqDto>>(request);
            return Ok(getRequest);
        }

        [HttpGet("{id}", Name = "GetThatMemberReq")]
        public IActionResult GetUserActivity(int id)
        {
            try
            {
                var getMemberRequest = _transActionRepo.GetRequests().FirstOrDefault(c => c.MemberReqId == id);

                if (getMemberRequest == null)
                {
                    return NotFound();
                }
                var getRequest = _transActionRepo.GetRequest(id);
                var getUserResult = Mapper.Map<MemberReqDto>(getRequest);
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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newRequest = Mapper.Map<TraMemberReq>(createRequest);


            _transActionRepo.CreateRequest(newRequest);

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var createdPointOfInterestToReturn = Mapper.Map<MemberReqDto>(newRequest);
            return CreatedAtRoute("GetThatEvent", new { id = createdPointOfInterestToReturn.MemberReqId }, createdPointOfInterestToReturn);


        }

        [HttpPut("{id}")]
        public IActionResult RequestUpdate(int id, [FromBody] MemberReqUpdateDto updateRequest)
        {
            var requestEntity = _transActionRepo.GetRequest(id);
            if (requestEntity == null) return NotFound();
            if (updateRequest == null) return NotFound();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            Mapper.Map(updateRequest, requestEntity);


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