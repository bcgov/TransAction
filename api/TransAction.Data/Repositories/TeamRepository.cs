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

        public IEnumerable<TraTeam> GetAll(string name, int page, int pageSize)
        {
            if (--page < 0) page = 0;
            var teams = FindAll();
            if (!string.IsNullOrEmpty(name))
            {
                teams = teams.Where(x => x.Name.Contains(name));
            }
            return teams.Include(x => x.User).Include(x => x.TraImage).Include(x => x.TraUser).OrderBy(x => x.Name).Skip(page * pageSize).Take(pageSize).ToList();

        }

        public TraTeam GetById(int id)
        {
            return Find(e => e.TeamId == id).Include(x => x.TraImage).Include(x => x.User).Include(x => x.TraUser).FirstOrDefault();
        }

        public bool GetTeamByName(string name)
        {
            var checkTeam = Find(c => c.Name == name).FirstOrDefault();
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
