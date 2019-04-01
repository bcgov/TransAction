using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace TransAction.Data.Models
{
    public partial class TransActionContext : DbContext
    {
       // public DateTime DbCreateTimestamp { get; set; } 
       // public DateTime DbLastUpdateTimestamp { get; set; } 
        
        public override int SaveChanges()
        {
            IEnumerable<EntityEntry> modifiedEntries = ChangeTracker.Entries()
                .Where(x => x.State == EntityState.Modified || 
                            x.State == EntityState.Added);

            DateTime currentTime = DateTime.UtcNow;

            foreach(EntityEntry entry in modifiedEntries)
            {
                if(entry.State == EntityState.Added)
                {

                    var createTimeStampProp = entry.Member("DbCreateTimestamp");
                    createTimeStampProp.CurrentValue = currentTime;

                    var lastUpdateTimeStampProp = entry.Member("DbLastUpdateTimestamp");
                    lastUpdateTimeStampProp.CurrentValue = createTimeStampProp.CurrentValue;
                   

                }
                else if (entry.State == EntityState.Modified)
                {
                    var lastUpdateTimeStampProp = entry.Member("DbLastUpdateTimestamp");
                    lastUpdateTimeStampProp.CurrentValue = currentTime;
                }
                
            }

            int result;
            try
            {
                result = base.SaveChanges();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            base.SaveChanges();

            return result;
        }
    }
}
