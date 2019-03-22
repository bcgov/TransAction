using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using TransAction.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace TransAction.Data.Services
{
    public class TransActionRepo : ITransActionRepo
    {
        private TransActionContext _context;
        public TransActionRepo(TransActionContext context)
        {
            _context = context;
        }

        public void CreateEvent(TraEvent traEvent)
        {
             _context.TraEvent.Add(traEvent);
        }

        public bool EventExists(string name)
        {
            var checkEvent = _context.TraEvent.FirstOrDefault(c => c.Name == name);
            if (checkEvent != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public TraEvent GetEvent(int id)
        {
            return _context.TraEvent.FirstOrDefault(c => c.EventId == id);
        }

        public IEnumerable<TraEvent> GetEvents()
        {
            return _context.TraEvent.OrderBy(c => c.EventId).ToList();
        }

        public bool Save()
        {
            return (_context.SaveChanges() >= 0);
        }
       

    }
}
