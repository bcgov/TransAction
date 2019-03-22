using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using TransAction.Data.Models;

namespace TransAction.Data.Services
{
    public interface ITransActionRepo
    {
        IEnumerable<TraEvent> GetEvents();

        TraEvent GetEvent(int id);
        bool Save();
        void CreateEvent(TraEvent traEvent);
        bool EventExists(string Name);
        
    }
}
