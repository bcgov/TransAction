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

        public IEnumerable<TraUser> GetAll()
        {
            return FindAll().Include(x => x.TraImage).ToList();
        }

        public TraUser GetById(int id)
        {
            return Find(e => e.UserId == id).Include(x => x.TraImage).FirstOrDefault();
        }
        public TraUser GetByGuid(string guid)
        {
            return Find(e => e.Guid == guid).Include(x => x.TraImage).FirstOrDefault();
        }
    }
}
