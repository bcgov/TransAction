using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using TransAction.Data.Models;
using TransAction.Data.Repositories.Interfaces;
using AutoMapper;

namespace TransAction.API.Controllers
{
    [Route("api/teamrequests")]
    public class TeamRequestController : BaseController
    {

        public TeamRequestController(IHttpContextAccessor httpContextAccessor, ILogger<ActivityController> logger, IUnitOfWork unitOfWork, IMapper mapper) :
            base(httpContextAccessor, logger, unitOfWork, mapper)
        { }

        [HttpGet()]
        public IActionResult GetRequests(int page = 1, int pageSize = 25)
        {
            var request = _unitOfWork.Request.GetAllReq(page, pageSize);
            var getRequest = _mapper.Map<IEnumerable<MemberReqDto>>(request);
            return Ok(getRequest);
        }

        [HttpGet("{id}", Name = "GetMemberReq")]
        public IActionResult GetUserActivityById(int id)
        {
            try
            {
                var getMemberRequest = _unitOfWork.Request.GetReqById(id);

                if (getMemberRequest == null)
                {
                    return NotFound();
                }
                var getRequest = _unitOfWork.Request.GetReqById(id);
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

            var getUser = _unitOfWork.User.GetById(createRequest.UserId);//if the user is on team then he cant create a request.
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

            _unitOfWork.Request.Create(newRequest);

            if (!_unitOfWork.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var createMemberReqResult = _mapper.Map<MemberReqDto>(newRequest);
            return CreatedAtRoute("GetMemberReq", new { id = createMemberReqResult.MemberReqId }, createMemberReqResult);


        }

        [HttpPut("{id}")]
        public IActionResult UpdateRequest(int id, [FromBody] MemberReqUpdateDto updateRequest)
        {
            var requestEntity = _unitOfWork.Request.GetReqById(id);
            if (requestEntity == null) return NotFound();
            if (updateRequest == null) return NotFound();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _mapper.Map(updateRequest, requestEntity);
            _unitOfWork.Request.Update(requestEntity);

            if (!_unitOfWork.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            return NoContent();
        }

        [HttpGet("team/{teamId}")]
        public IActionResult CurrentTeamRequests(int teamId)
        {
            var result = _unitOfWork.Request.CurrentTeamReq(teamId);
            return Ok(result);
        }
    }
}