using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using TransAction.Data.Models;
using TransAction.Data.Repositories.Interfaces;

namespace TransAction.Data.Repositories
{
    public class TeamRepository : RepositoryBase<TraTeam>, ITeamRepository
    {
        public TeamRepository(TransActionContext context) : base(context)
        {

        }

        public IEnumerable<TraTeam> GetAll()
        {
            return FindAll().ToList();
        }

        public TraTeam GetById(int id)
        {
            return Find(e => e.TeamId == id).FirstOrDefault();
        }
 
    }
}
