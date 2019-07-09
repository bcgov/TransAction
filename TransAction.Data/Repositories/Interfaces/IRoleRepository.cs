using System;
using System.Collections.Generic;
using System.Text;
using TransAction.Data.Models;

namespace TransAction.Data.Repositories.Interfaces
{
    public interface IRoleRepository
    {
        IEnumerable<TraRole> GetAll(int page, int pageSize);
        TraRole GetById(int id);
        IEnumerable<TraRole> GetByTeamId(int teamId);
        void Create(TraRole newUser);
        void Update(TraRole updateUser);
    }
}
