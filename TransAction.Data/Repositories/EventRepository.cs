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

        public IEnumerable<TraEvent> GetAll(int page, int pageSize, string name, bool isAcitve)
        {
            if (--page < 0) page = 0;
            var events = FindAll().Where(x => x.IsActive == isAcitve);
            if (!string.IsNullOrEmpty(name))
            {
                events = events.Where(x => x.Name.Contains(name));
            }
            return events.OrderByDescending(x => x.StartDate).Skip(page * pageSize).Take(pageSize).ToList();

        }

        public TraEvent GetById(int id)
        {
            return Find(e => e.EventId == id).FirstOrDefault();
        }
        public int Count(string name, bool isActive)
        {
            var eventCount = FindAll().Where(x => x.IsActive == isActive);
            if (!string.IsNullOrEmpty(name))
            {
                return eventCount.Where(x => x.Name.Contains(name)).Count();
            }
            return eventCount.Count();
        }
    }
}
