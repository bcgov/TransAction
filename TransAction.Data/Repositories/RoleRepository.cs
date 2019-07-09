using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TransAction.Data.Models;
using TransAction.Data.Repositories.Interfaces;

namespace TransAction.Data.Repositories
{
    public class RoleRepository : RepositoryBase<TraRole>, IRoleRepository
    {
        public RoleRepository(TransActionContext repositoryContext) : base(repositoryContext)
        {
        }

        public IEnumerable<TraRole> GetAllRoles(int page, int pageSize)
        {
            if (--page < 0) page = 0;
            return FindAll().Skip(page * pageSize).Take(pageSize).ToList();
        }

        public TraRole GetRoleById(int id)
        {
            return Find(c => c.RoleId == id).FirstOrDefault();
        }

        public bool RoleExists(string Name)
        {
            var checkRole = FindAll().FirstOrDefault(c => c.Name == Name);
            if (checkRole != null)
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
