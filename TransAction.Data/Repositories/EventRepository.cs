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

        public IEnumerable<TraEvent> GetAll(int page, int pageSize)
        {
            if (--page < 0) page = 0;
            return FindAll().Where(x => x.IsActive == true).Skip(page * pageSize).Take(pageSize).ToList();
        }

        public TraEvent GetById(int id)
        {
            return Find(e => e.EventId == id).FirstOrDefault();
        }

        public int GetCount()
        {
            return FindAll().Where(x => x.IsActive == true).Count();
        }
    }
}
