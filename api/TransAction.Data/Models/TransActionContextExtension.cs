using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace TransAction.Data.Models
{
    public partial class TransActionContext : DbContext
    {

        public override int SaveChanges()
        {
            IEnumerable<EntityEntry> modifiedEntries = ChangeTracker.Entries()
                .Where(x => x.State == EntityState.Modified ||
                            x.State == EntityState.Added);

            DateTime currentTime = DateTime.UtcNow;

            foreach (EntityEntry entry in modifiedEntries)
            {
                if (entry.State == EntityState.Added)
                {

                    var createTimeStampProp = entry.Member("DbCreateTimestamp");
                    createTimeStampProp.CurrentValue = currentTime;


                    var concurrencyControl = entry.Member("ConcurrencyControlNumber");
                    Int64 controlNumber = 1;
                    concurrencyControl.CurrentValue = controlNumber;


                    var lastUpdateTimeStampProp = entry.Member("DbLastUpdateTimestamp");
                    lastUpdateTimeStampProp.CurrentValue = currentTime;


                    var createUserId = entry.Member("DbCreateUserid");
                    createUserId.CurrentValue = "Test Value";

                    var lastUserId = entry.Member("DbLastUpdateUserid");
                    lastUserId.CurrentValue = "Test Value";



                }
                else if (entry.State == EntityState.Modified)
                {
                    var concurrencyControl = entry.Member("ConcurrencyControlNumber");
                    concurrencyControl.CurrentValue = (Int64)concurrencyControl.CurrentValue + 1;
                }

            }

            int result = 0;
            try
            {
                result = base.SaveChanges();
            }
            catch (Exception e)
            {
                if (!e.InnerException.Message.Contains(" Cannot insert duplicate key in object 'dbo.TRA_USER'."))
                {
                    string exceptionMessage = e.ToString();
                    _logger.LogError($"TransActionContext exception: {exceptionMessage}");
                    throw;
                }
            }

            return result;
        }
    }
}
