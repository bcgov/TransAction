using System.Collections.Generic;
using TransAction.Data.Models;

namespace TransAction.Data.Repositories.Interfaces
{
    public interface IUserRepository
    {
        IEnumerable<TraUser> GetAll(int page, int pageSize);
        TraUser GetById(int id);
        TraUser GetByGuid(string guid);
        IEnumerable<TraUser> GetByTeamId(int teamId);
        void Create(TraUser newUser);
        void Update(TraUser updateUser);
    }
}
