﻿using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using TransAction.Data.Models;

namespace TransAction.Data.Services
{
    public interface ITransActionRepo
    {
        IEnumerable<TraEvent> GetEvents();
        TraEvent GetEvent(int id);
        void CreateEvent(TraEvent traEvent);
        bool EventExists(string Name);

        IEnumerable<TraUser> GetUsers();
        TraUser GetUser(int id);
        bool UserExists(string Name, string Email);
        void CreateUser(TraUser traUser);

        IEnumerable<TraTeam> GetTeams();
        TraTeam GetTeam(int id);
        bool TeamExists(string Name);
        void CreateTeam(TraTeam traTeam);

        IEnumerable<TraRegion> GetRegions();
        TraRegion GetRegion(int id);
        bool RegionExists(string Name);
        void CreateRegion(TraRegion traRegion);

        bool Save();
    }
}
