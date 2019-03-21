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

       // TraEvent EventUpdate(int id);

        bool Save();

        bool EventExists(int id);
        
    }
}
