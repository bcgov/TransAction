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

        public IEnumerable<TraEvent> GetAll()
        {
            return FindAll().ToList();
        }

        public TraEvent GetById(int id)
        {
            return Find(e => e.EventId == id).FirstOrDefault();
        }
    }
}
