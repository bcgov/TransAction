using System;
using System.Collections.Generic;
using System.Text;
using TransAction.Data.Models;

namespace TransAction.Data.Repositories.Interfaces
{
    public interface ITeamRepository
    {
        IEnumerable<TraTeam> GetAll(int page, int pageSize);
        TraTeam GetById(int id);
        void Create(TraTeam newTeam);
        void Update(TraTeam updateTeam);
        bool GetTeamByName(string Name);
        int Count();
    }
}
