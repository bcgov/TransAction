using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TransAction.Data.Models;

namespace TransAction.Data.Repositories
{
    public interface IRegionRepository
    {
        Task<IEnumerable<TraRegion>> GetRegions();
        TraRegion GetRegion(int id);
        bool RegionExists(string Name);
        void CreateRegion(TraRegion traRegion);
    }
}
