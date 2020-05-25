using System;
using System.Collections.Generic;
using System.Text;
using TransAction.Data.Models;

namespace TransAction.Data.Repositories.Interfaces
{
    public interface IImageRepository
    {
        TraImage GetUserProfileImage(int userId);
        TraImage GetTeamProfileImage(int teamId);
        TraImage GetProfileImage(string guid);
        void Create(TraImage newImage);
        //void AddProfileImage(TraImage image);
    }
}
