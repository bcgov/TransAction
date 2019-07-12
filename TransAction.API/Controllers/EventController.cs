using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using TransAction.API.Authorization;
using TransAction.Data.Models;

namespace TransAction.API.Controllers
{
    [Route("api/events")]
    public class EventController : BaseController
    {

        public EventController(IHttpContextAccessor httpContextAccessor, ILogger<EventController> logger) :
            base(httpContextAccessor, logger)
        { }


        [HttpGet()]
        public IActionResult GetEvents(int page = 1, int pageSize = 25)
        {
            var events = _unitOfWork.Event.GetAll(page, pageSize);
            var getEvents = _mapper.Map<IEnumerable<EventDto>>(events);
            return Ok(getEvents);

        }


        [HttpGet("{id}", Name = "GetEvent")]
        public IActionResult GetEventById(int id)
        {
            try
            {
                var getEvent = _unitOfWork.Event.GetById(id);

                if (getEvent == null)
                {
                    return NotFound();
                }

                var getEventResult = _mapper.Map<EventDto>(getEvent);
                return Ok(getEventResult);

            }

            catch (Exception)
            {
                return StatusCode(500, "A problem happened while handeling your request");
            }

        }

        [ClaimRequirement(AuthorizationTypes.ADMIN_CLAIM)]
        [HttpPost()]
        public IActionResult CreateEvent([FromBody] EventCreateDto createEvent)
        {
            if (createEvent == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (createEvent.StartDate > createEvent.EndDate)
            {
                return BadRequest();
            }

            var newEvent = _mapper.Map<TraEvent>(createEvent);
            newEvent.IsActive = true;

            _unitOfWork.Event.Create(newEvent);

            if (!_unitOfWork.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var createEventResult = _mapper.Map<EventDto>(newEvent);
            return CreatedAtRoute("GetEvent", new { id = createEventResult.EventId }, createEventResult);
        }

        [ClaimRequirement(AuthorizationTypes.ADMIN_CLAIM)]
        [HttpPut("{id}")]
        public IActionResult UpdateEvent(int id, [FromBody] EventUpdateDto updateEvent)
        {
            var eventEntity = _unitOfWork.Event.GetById(id);
            if (eventEntity == null) return NotFound();
            if (updateEvent == null) return NotFound();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _mapper.Map(updateEvent, eventEntity);
            _unitOfWork.Event.Update(eventEntity);
            if (!_unitOfWork.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            return GetEventById(id);
        }
    }
}
