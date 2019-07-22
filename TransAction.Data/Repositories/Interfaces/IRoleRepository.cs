using System;
using System.Collections.Generic;
using System.Text;
using TransAction.Data.Models;

namespace TransAction.Data.Repositories.Interfaces
{
    public interface IRoleRepository
    {
        IEnumerable<TraRole> GetAllRoles(int page, int pageSize);
        TraRole GetRoleById(int id);
        void Create(TraRole newRole);
        void Update(TraRole updateRole);
        bool RoleExists(string Name);
        int Count();
    }
}
