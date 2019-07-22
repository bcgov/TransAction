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

        public IEnumerable<TraTeam> GetAll(int page, int pageSize)
        {
            if (--page < 0) page = 0;
            return FindAll().Skip(page * pageSize).Take(pageSize).ToList();
        }

        public TraTeam GetById(int id)
        {
            return Find(e => e.TeamId == id).FirstOrDefault();
        }

        public bool GetTeamByName(string Name)
        {
            var checkTeam = Find(c => c.Name == Name).FirstOrDefault();
            if (checkTeam != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

    }
}
