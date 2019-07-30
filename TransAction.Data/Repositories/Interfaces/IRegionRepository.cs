using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TransAction.Data.Models;

namespace TransAction.Data.Repositories.Interfaces
{
    public interface IRegionRepository
    {
        IEnumerable<TraRegion> GetAllRegions(int page, int pageSize);
        TraRegion GetRegionById(int id);
        bool RegionExists(string Name);
        void Create(TraRegion newRegion);
        void Update(TraRegion updateRegion);
        int Count();
    }
}
