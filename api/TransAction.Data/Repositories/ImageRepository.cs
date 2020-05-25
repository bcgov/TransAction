using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using TransAction.Data.Models;
using TransAction.Data.Repositories.Interfaces;

namespace TransAction.Data.Repositories
{
    public class ImageRepository : RepositoryBase<TraImage>, IImageRepository
    {
        public ImageRepository(TransActionContext repositoryContext) : base(repositoryContext)
        {
        }

        //public void AddProfileImage(TraImage image)
        //{
        //    _context.Add()
        //}

        public TraImage GetProfileImage(string guid)
        {
            return Find(x => x.Guid == guid).FirstOrDefault();
        }

        public TraImage GetTeamProfileImage(int teamId)
        {
            return Find(x => x.TeamId == teamId).FirstOrDefault();
        }

        public TraImage GetUserProfileImage(int userId)
        {
            return Find(x => x.UserId == userId).FirstOrDefault();
        }
    }
}
