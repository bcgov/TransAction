using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TransAction.Data.Models;
using TransAction.Data.Repositories.Interfaces;
namespace TransAction.Data.Repositories
{
    public class RegionRepository : RepositoryBase<TraRegion>, IRegionRepository
    {
        public RegionRepository(TransActionContext context) : base(context)
        {

        }

        public int Count()
        {
            return FindAll().Count();
        }

        public IEnumerable<TraRegion> GetAllRegions(int page, int pageSize)
        {
            if (--page < 0) page = 0;
            return FindAll().Skip(page * pageSize).Take(pageSize).ToList();
        }

        public TraRegion GetRegionById(int id)
        {
            return Find(e => e.RegionId == id).FirstOrDefault();
        }

        public bool RegionExists(string Name)
        {
            var checkRegion = Find(c => c.Name == Name).FirstOrDefault();
            if (checkRegion != null)
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

