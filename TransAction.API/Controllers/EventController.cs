using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TransAction.Data.Models;
using TransAction.Data.Services;

namespace TransAction.API.Controllers
{
    [Route("api/events")]
    public class EventController : Controller
    {
        private ITransActionRepo _transActionRepo;
        public EventController(ITransActionRepo transActionRepo, IHttpContextAccessor httpContextAccessor)
        {
            _transActionRepo = transActionRepo;
            var userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.GivenName).Value; // nameIdentifeir gives the Id and the .Name gives the username
            var userEmail = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Email).Value;
            var checkUser = _transActionRepo.UserExists(userId,userEmail);
         //   if (!checkUser) ExitController();
            
        }

        [HttpGet()]
        public IActionResult GetEvents()
        {
            var events = _transActionRepo.GetEvents();
            var getEvents = Mapper.Map<IEnumerable<EventDto>>(events);
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
                var getEventResult = Mapper.Map<EventDto>(getEvent);
                return Ok(getEventResult);

            }

            catch (Exception)
            {
                return StatusCode(500, "A problem happened while handeling your request");
            }

        }


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

            var newEvent = Mapper.Map<TraEvent>(createEvent);
          

            _transActionRepo.CreateEvent(newEvent);          

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var createdPointOfInterestToReturn = Mapper.Map<EventDto>(newEvent);
            return CreatedAtRoute("GetThatEvent", new { id = createdPointOfInterestToReturn.EventId }, createdPointOfInterestToReturn);


        }

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
            Mapper.Map(updateEvent,eventEntity);


            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            return NoContent();
        }
    }
}
