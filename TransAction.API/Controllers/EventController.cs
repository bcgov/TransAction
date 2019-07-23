using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using TransAction.API.Authorization;
using TransAction.Data.Models;
using TransAction.Data.Repositories.Interfaces;
using AutoMapper;
using TransAction.API.Responses;

namespace TransAction.API.Controllers
{
    [Route("api/events")]
    public class EventController : BaseController
    {

        public EventController(IHttpContextAccessor httpContextAccessor, ILogger<ActivityController> logger, IUnitOfWork unitOfWork, IMapper mapper) :
            base(httpContextAccessor, logger, unitOfWork, mapper)
        { }


        [HttpGet()]
        public IActionResult GetEvents(string Name, int page = 1, int pageSize = 25)
        {
            var events = _unitOfWork.Event.GetAll(page, pageSize, Name);
            var getEvents = _mapper.Map<IEnumerable<EventDto>>(events);
            int count = _unitOfWork.Event.GetCount(Name);
            return StatusCode(200, new TransActionPagedResponse(getEvents, page, pageSize, count));

        }


        [HttpGet("{id}", Name = "GetEvent")]
        public IActionResult GetEventById(int id)
        {
            try
            {
                var getEvent = _unitOfWork.Event.GetById(id);

                if (getEvent == null)
                {
                    return StatusCode(404, new TransActionResponse("No Event Found"));
                }

                var getEventResult = _mapper.Map<EventDto>(getEvent);
                return StatusCode(200, new TransActionResponse(getEventResult));

            }

            catch (Exception)
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request."));
            }

        }


        [ClaimRequirement(AuthorizationTypes.ADMIN_CLAIM)]
        [HttpPost()]
        public IActionResult CreateEvent([FromBody] EventCreateDto createEvent)
        {
            if (createEvent == null)
            {
                return BadRequest(new TransActionResponse("No event entered"));
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new TransActionResponse(ModelState));
            }

            if (createEvent.StartDate > createEvent.EndDate)
            {
                return BadRequest(new TransActionResponse("Start date cannot be greater than the end date"));
            }

            var newEvent = _mapper.Map<TraEvent>(createEvent);
            newEvent.IsActive = true;

            _unitOfWork.Event.Create(newEvent);

            if (!_unitOfWork.Save())
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request."));
            }

            var createEventResult = _mapper.Map<EventDto>(newEvent);
            return CreatedAtRoute("GetEvent", new { id = createEventResult.EventId }, new TransActionResponse(createEventResult));
        }

        [ClaimRequirement(AuthorizationTypes.ADMIN_CLAIM)]
        [HttpPut("{id}")]
        public IActionResult UpdateEvent(int id, [FromBody] EventUpdateDto updateEvent)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new TransActionResponse(ModelState));
            }
            var eventEntity = _unitOfWork.Event.GetById(id);
            if (eventEntity == null) return StatusCode(404, new TransActionResponse("Event Not found"));

            _mapper.Map(updateEvent, eventEntity);
            _unitOfWork.Event.Update(eventEntity);
            if (!_unitOfWork.Save())
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request."));
            }

            return GetEventById(id);
        }
    }
}
