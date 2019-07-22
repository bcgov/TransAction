using System.Collections.Generic;
using TransAction.Data.Models;

namespace TransAction.Data.Repositories.Interfaces
{
    public interface IEventRepository
    {
        IEnumerable<TraEvent> GetAll(int page, int pageSize);
        TraEvent GetById(int id);
        void Create(TraEvent newEvent);
        void Update(TraEvent updateEvent);
    }
}
