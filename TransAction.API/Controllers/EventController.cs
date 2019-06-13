using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
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
        public IActionResult GetEvents()
        {
            var events = _transActionRepo.GetEvents();
            var getEvents = _mapper.Map<IEnumerable<EventDto>>(events);
            return Ok(getEvents);

        }


        [HttpGet("{id}", Name = "GetThatEvent")]
        public IActionResult GetEvent(int id)
        {
            try
            {
                var getEvents = _transActionRepo.GetEvents().FirstOrDefault(c => c.EventId == id);

                if (getEvents == null)
                {
                    return NotFound();
                }
                var getEvent = _transActionRepo.GetEvent(id);
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
            if (createEvent.Description == null || createEvent.EndDate == null || createEvent.StartDate == null)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (_transActionRepo.EventExists(createEvent.Name))
            {
                return BadRequest();
            }

            if(createEvent.StartDate > createEvent.EndDate)
            {
                var hello = createEvent.StartDate > createEvent.EndDate;
                return BadRequest();
            }

            var newEvent = _mapper.Map<TraEvent>(createEvent);
            newEvent.IsActive = true;
            

            _transActionRepo.CreateEvent(newEvent);          

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var createdPointOfInterestToReturn = _mapper.Map<EventDto>(newEvent);
            return CreatedAtRoute("GetThatEvent", new { id = createdPointOfInterestToReturn.EventId }, createdPointOfInterestToReturn);


        }

        [ClaimRequirement(AuthorizationTypes.ADMIN_CLAIM)]
        [HttpPut("{id}")]
        public IActionResult EventUpdate(int id, [FromBody] EventUpdateDto updateEvent)
        {
            var eventEntity = _transActionRepo.GetEvent(id);
            if (eventEntity == null) return NotFound();
            if (updateEvent == null) return NotFound();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _mapper.Map(updateEvent,eventEntity);


            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            return GetEvent(id);
        }
    }
}
