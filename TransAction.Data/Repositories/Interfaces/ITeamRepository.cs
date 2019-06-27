using System;
using System.Collections.Generic;
using System.Text;
using TransAction.Data.Models;

namespace TransAction.Data.Repositories.Interfaces
{
    public interface ITeamRepository
    {
        IEnumerable<TraTeam> GetAll();
        TraTeam GetById(int id);
        void Create(TraTeam newTeam);
    }
}
