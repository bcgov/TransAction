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

        public int Count(string Name)
        {
            var teamCount = FindAll();
            if (!string.IsNullOrEmpty(Name))
            {
                return teamCount.Where(x => x.Name.Contains(Name)).Count();
            }
            return teamCount.Count();
        }

        public IEnumerable<TraTeam> GetAll(string Name, int page, int pageSize)
        {
            if (--page < 0) page = 0;
            var teams = FindAll();
            if (!string.IsNullOrEmpty(Name))
            {
                teams = teams.Where(x => x.Name.Contains(Name));
            }
            return teams.OrderBy(x => x.Name).Skip(page * pageSize).Take(pageSize).ToList();

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
