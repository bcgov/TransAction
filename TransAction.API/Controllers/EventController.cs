using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TransActionPractice.Models;

namespace TransActionPractice.Controllers
{
    [Route("api/events")]
    public class EventController : Controller
    {
        private TransActionPracticeContext _context;

        public EventController(TransActionPracticeContext context)
        {
            _context = context;
        }
                       
        [HttpPost()]
        public async Task<ActionResult<TraEvent>> PostEvent(TraEvent item)
        {
            _context.TraEvent.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEvents), new { id = item.EventId }, item);
        }

        [HttpGet()]
        public IActionResult GetEvents()
        {

            if (_context.TraEvent == null)
            {
                return NotFound();
            }
            return Ok(_context.TraEvent);
        }

        [HttpGet("{id}")]
        public IActionResult GetEvent(int id)
        {
            var EventD = _context.TraEvent.FirstOrDefault(c => c.EventId == id);
            if (EventD == null)
            {
                return NotFound();
            }
            return Ok(EventD);
        }
    }
}
