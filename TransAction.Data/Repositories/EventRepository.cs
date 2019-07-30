using System.Collections.Generic;
using System.Linq;
using TransAction.Data.Models;
using TransAction.Data.Repositories.Interfaces;

namespace TransAction.Data.Repositories
{
    public class EventRepository : RepositoryBase<TraEvent>, IEventRepository
    {
        public EventRepository(TransActionContext context) : base(context)
        {

        }

        public IEnumerable<TraEvent> GetAll(int page, int pageSize, string Name)
        {
            if (--page < 0) page = 0;
            var events = FindAll().Where(x => x.IsActive == true);
            if (!string.IsNullOrEmpty(Name))
            {
                events = events.Where(x => x.Name.Contains(Name));
            }
            return events.OrderByDescending(x => x.StartDate).Skip(page * pageSize).Take(pageSize).ToList();

        }

        public TraEvent GetById(int id)
        {
            return Find(e => e.EventId == id).FirstOrDefault();
        }
        public int GetCount(string Name)
        {
            var eventCount = FindAll().Where(x => x.IsActive == true);
            if (!string.IsNullOrEmpty(Name))
            {
                return eventCount.Where(x => x.Name.Contains(Name)).Count();
            }
            return eventCount.Count();
        }
    }
}
