using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using TransAction.Data.Models;
using TransAction.Data.Repositories.Interfaces;

namespace TransAction.Data.Repositories
{
    public class ActivityRepository : RepositoryBase<TraActivity>, IActivityRepository
    {
        public ActivityRepository(TransActionContext repositoryContext) : base(repositoryContext)
        {
        }

        public bool ActivityExists(string Name)
        {
            var checkActivity = FindAll().FirstOrDefault(c => c.Name == Name);
            if (checkActivity != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public IEnumerable<TraActivity> GetAll(int page, int pageSize)
        {
            if (--page < 0) page = 0;
            return FindAll().OrderBy(c => c.ActivityId).Skip(page * pageSize).Take(pageSize).ToList();
        }

        public TraActivity GetById(int id)
        {
            return Find(e => e.ActivityId == id).FirstOrDefault();
        }
    }
}
