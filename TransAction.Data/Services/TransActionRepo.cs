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

        /*-----------------------------------------------------------------------------------------*/

        public TraUser GetUser(int id)
        {
            return _context.TraUser.FirstOrDefault(c => c.UserId == id);
        }

        public IEnumerable<TraUser> GetUsers()
        {
            return _context.TraUser.OrderBy(c => c.UserId).ToList();
        }



        public void CreateUser(TraUser traUser)
        {
            _context.TraUser.Add(traUser);
        }

        public bool UserExists(string Name, string Email)
        {
            var checkUser = _context.TraUser.FirstOrDefault(c => c.Username == Name || c.Email == Email);
            if (checkUser != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public TraUser GetCurrentUser(string guid)
        {
            return _context.TraUser.FirstOrDefault(c => c.Guid == guid);
        }


        public bool Save()
        {
            return (_context.SaveChanges() >= 0);
        }
        /*---------------------------------------------------------------------------------------------*/
        public IEnumerable<TraTeam> GetTeams()
        {
            return _context.TraTeam.OrderBy(c => c.TeamId).ToList();
        }

        public TraTeam GetTeam(int id)
        {
            return _context.TraTeam.FirstOrDefault(c => c.TeamId == id);
        }

        public void CreateTeam(TraTeam traTeam)
        {
            _context.TraTeam.Add(traTeam);
        }

        public bool TeamExists(string Name)
        {
            var checkTeam = _context.TraTeam.FirstOrDefault(c => c.Name == Name);
            if (checkTeam != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
/*--------------------------------------------------------------------------*/
        public IEnumerable<TraRegion> GetRegions()
        {
            return _context.TraRegion.OrderBy(c => c.RegionId).ToList();
        }

        public TraRegion GetRegion(int id)
        {
            return _context.TraRegion.FirstOrDefault(c => c.RegionId == id);
        }

        public bool RegionExists(string Name)
        {
            var checkRegion = _context.TraRegion.FirstOrDefault(c => c.Name == Name);
            if (checkRegion != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        public void CreateRegion(TraRegion traRegion)
        {
            _context.TraRegion.Add(traRegion);
        }

        /*--------------------------------------------------------------------------*/

        public IEnumerable<TraActivity> GetActivities()
        {
            return _context.TraActivity.OrderBy(c => c.ActivityId).ToList();
        }

        public TraActivity GetActivity(int id)
        {
            return _context.TraActivity.FirstOrDefault(c => c.ActivityId == id);
        }

        public bool ActivityExists(string Name)
        {
            var checkActivity = _context.TraActivity.FirstOrDefault(c => c.Name == Name);
            if (checkActivity != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public void CreateActivity(TraActivity traActivity)
        {
            _context.TraActivity.Add(traActivity); 
        }
    }
}
