using System.Collections.Generic;
using TransAction.Data.Models;

namespace TransAction.Data.Repositories.Interfaces
{
    public interface IEventRepository
    {
        IEnumerable<TraEvent> GetAll();
        TraEvent GetById(int id);
        void Create(TraEvent newEvent);
    }
}
