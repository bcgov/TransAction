using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using TransAction.Data.Models;
using TransAction.Data.Repositories.Interfaces;

namespace TransAction.Data.Repositories
{
    public class UserRepository : RepositoryBase<TraUser>, IUserRepository
    {
        public UserRepository(TransActionContext context) : base(context)
        {

        }

        public IEnumerable<TraUser> GetAll(int page, int pageSize)
        {

            if (--page < 0) page = 0;
            return FindAll().Include(x => x.TraImage).Skip(page * pageSize).Take(pageSize).ToList();

        }

        public TraUser GetById(int id)
        {
            return Find(e => e.UserId == id).Include(x => x.Role).Include(x => x.TraImage).FirstOrDefault();
        }
        public TraUser GetByGuid(string guid)
        {
            return Find(e => e.Guid == guid).Include(x => x.Role).Include(x => x.TraImage).FirstOrDefault();
        }

        public IEnumerable<TraUser> GetByTeamId(int teamId)
        {
            return Find(e => e.TeamId == teamId).ToList();
        }

        public TraUser GetCurrentUser(string guid)
        {
            return Find(c => c.Guid == guid).Include(x => x.Role).Include(x => x.TraImage).FirstOrDefault();
        }

        public int Count()
        {
            return FindAll().Include(x => x.TraImage).Count();
        }
    }
}
