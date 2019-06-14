using System.Collections.Generic;
using TransAction.Data.Models;

namespace TransAction.Data.Repositories.Interfaces
{
    public interface IUserRepository
    {
        IEnumerable<TraUser> GetAll();
        TraUser GetById(int id);
        TraUser GetByGuid(string guid);
        void Create(TraUser newEvent);
    }
}
