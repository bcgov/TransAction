using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TransAction.Data.Models;
using TransAction.Data.Services;

namespace TransAction.API.Controllers
{
    [Route("api/events")]
    public class EventController : Controller
    {
        private ITransActionRepo _TransActionRepo;
        private TransActionContext _context;
        public EventController(ITransActionRepo transActionRepo, TransActionContext context)
        {
            _TransActionRepo = transActionRepo;
            _context = context;
        }

        /*
        [HttpPost()]
        public async Task<ActionResult<TraEvent>> PostEvent(TraEvent item)
        {
            _context.TraEvent.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEvents), new { id = item.EventId }, item);
        }*/
                   
       
        [HttpGet()]
        public IActionResult GetEvents()
        {
            var TEntities = _TransActionRepo.GetEvents();
            var results = new List<EventDto>();

            foreach (var Nevent in TEntities)
            {
                results.Add(new EventDto
                {
                    EventId = Nevent.EventId,
                    Description = Nevent.Description,
                    StartDate = Nevent.StartDate,
                    EndDate = Nevent.EndDate
                });
            }
            return Ok(results);
        }
        

        [HttpGet("{id}")]
        public IActionResult GetEvent(int id)
        {
            var EventD = _TransActionRepo.GetEvents().FirstOrDefault(c => c.EventId == id);

            if (EventD == null)
            {
                return NotFound();
            }
            
            var result = new EventDto()
            {
                EventId = EventD.EventId,
                Description = EventD.Description,
                StartDate = EventD.StartDate,
                EndDate = EventD.EndDate
            };
            
            return Ok(result);
            
        }


        [HttpPost()]
        public IActionResult CreateEvent([FromBody] EventCreateDto create_event)
        {
            if (create_event == null)
            {
                return BadRequest();
            }
            if (create_event.Description == null || create_event.EndDate == null || create_event.StartDate == null)
            {
                return BadRequest();
            }
           // if(! _TransActionRepo.EventExists())
            
            var result = new TraEvent()
            {
                Description = create_event.Description,
                StartDate = create_event.StartDate,
                EndDate = create_event.EndDate
            };
            _context.TraEvent.Add(result);
            return CreatedAtRoute("New Event Created", new
            { NewId = result.EventId }, result);

        }

        [HttpPut("{id}")]
        public IActionResult EventUpdate(int id, [FromBody] EventUpdateDto UEvent)
        {
            var Event = _TransActionRepo.GetEvent(id);
            if (Event == null) return NotFound();
            if (UEvent == null) return NotFound();

            Mapper.Map(UEvent,Event);

            if (!_TransActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }
            
            return NoContent();
        }
    }
}
