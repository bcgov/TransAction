﻿using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using TransAction.Data.Models;
using TransAction.Data.Helpers;
using Microsoft.EntityFrameworkCore;

namespace TransAction.Data.Services
{
    public class TransActionRepo : ITransActionRepo
    {
        private TransActionContext _context;
        public TransActionRepo(TransActionContext context)
        {
            _context = context;
        }

        public void CreateEvent(TraEvent traEvent)
        {
            _context.TraEvent.Add(traEvent);
        }

        public bool EventExists(string name)
        {
            var checkEvent = _context.TraEvent.FirstOrDefault(c => c.Name == name);
            if (checkEvent != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public TraEvent GetEvent(int id)
        {
            return _context.TraEvent.FirstOrDefault(c => c.EventId == id);
        }

        public IEnumerable<TraEvent> GetEvents()
        {
            return _context.TraEvent.OrderBy(c => c.EventId).ToList();
        }

        /*-----------------------------------------------------------------------------------------------------------------------------*/

        public TraUser GetUser(int id)
        {
            return _context.TraUser.FirstOrDefault(c => c.UserId == id);
        }

        public IEnumerable<TraUser> GetUsers()
        {
            return _context.TraUser.OrderBy(c => c.UserId).ToList();
        }



        public void CreateUser(TraUser traUser)
        {
            _context.TraUser.Add(traUser);
        }

        public bool UserExists(string Name, string Email)
        {
            var checkUser = _context.TraUser.FirstOrDefault(c => c.Username == Name || c.Email == Email);
            if (checkUser != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public TraUser GetCurrentUser(string guid)
        {
            return _context.TraUser.FirstOrDefault(c => c.Guid == guid);
        }


        public bool Save()
        {
            return (_context.SaveChanges() >= 0);
        }
        /*-----------------------------------------------------------------------------------------------------------------------------*/
        public IEnumerable<TraTeam> GetTeams()
        {
            return _context.TraTeam.OrderBy(c => c.TeamId).ToList();

        }

        public TraTeam GetTeam(int id)
        {
            return _context.TraTeam.FirstOrDefault(c => c.TeamId == id);
        }

        public void CreateTeam(TraTeam traTeam)
        {
            _context.TraTeam.Add(traTeam);
        }

        public bool TeamExists(string Name)
        {
            var checkTeam = _context.TraTeam.FirstOrDefault(c => c.Name == Name);
            if (checkTeam != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        /*-----------------------------------------------------------------------------------------------------------------------------*/
        public IEnumerable<TraRegion> GetRegions()
        {
            return _context.TraRegion.OrderBy(c => c.RegionId).ToList();
        }

        public TraRegion GetRegion(int id)
        {
            return _context.TraRegion.FirstOrDefault(c => c.RegionId == id);
        }

        public bool RegionExists(string Name)
        {
            var checkRegion = _context.TraRegion.FirstOrDefault(c => c.Name == Name);
            if (checkRegion != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        public void CreateRegion(TraRegion traRegion)
        {
            _context.TraRegion.Add(traRegion);
        }

        /*-----------------------------------------------------------------------------------------------------------------------------*/

        public IEnumerable<TraActivity> GetActivities()
        {
            return _context.TraActivity.OrderBy(c => c.ActivityId).ToList();
        }

        public TraActivity GetActivity(int id)
        {
            return _context.TraActivity.FirstOrDefault(c => c.ActivityId == id);
        }

        public bool ActivityExists(string Name)
        {
            var checkActivity = _context.TraActivity.FirstOrDefault(c => c.Name == Name);
            if (checkActivity != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public void CreateActivity(TraActivity traActivity)
        {
            _context.TraActivity.Add(traActivity);
        }

        public IEnumerable<TraUserActivity> GetUserActivities()
        {
            return _context.TraUserActivity.OrderBy(c => c.UserActivityId).ToList();
        }

        public TraUserActivity GetUserActivity(int id)
        {
            return _context.TraUserActivity.FirstOrDefault(c => c.UserActivityId == id);
        }

        public bool UserActivityExists(string Name)
        {
            var checkUserActivity = _context.TraUserActivity.FirstOrDefault(c => c.Name == Name);
            if (checkUserActivity != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public void CreateUserActivity(TraUserActivity traUserActivity)
        {
            _context.TraUserActivity.Add(traUserActivity);
        }
        /*-----------------------------------------------------------------------------------------------------------------------------*/
        public int EventSpecificScore(int eventId)
        {

            var userAct = _context.TraUserActivity
                .Where(p => p.EventId == eventId)
                    .Include(x => x.Activity)
                    .GroupBy(x => new { x.EventId })
                    .Select(x => new
                    {
                        Score = x.Sum(y => y.Minutes * y.Activity.Intensity)
                    }).Select(c => c.Score).Sum();

            return userAct;

        }

        public int UserSpecificScore(int userId, int eventId)
        {
            var userAct = _context.TraUserActivity
                .Where(p => p.EventId == eventId && p.UserId == userId)
                    .Include(x => x.Activity)
                    .GroupBy(x => new { x.UserId, x.EventId })
                    .Select(x => new
                    {
                        Score = x.Sum(y => y.Minutes * y.Activity.Intensity)
                    }).Select(c => c.Score).Sum();

            return userAct;

        }

        public int TeamEventSpecificScore(int teamId, int eventId)
        {
            var userAct = _context.TraUserActivity
                .Where(p => p.EventId == eventId && p.TeamId == teamId)
                    .Include(x => x.Activity)
                    .GroupBy(x => new { x.TeamId, x.EventId })
                    .Select(x => new
                    {
                        Score = x.Sum(y => y.Minutes * y.Activity.Intensity)
                    }).Select(c => c.Score).Sum();

            return userAct;
        }

        public IEnumerable<TeamSpecificScoreDto> TopTeams(int number, int eventId)
        {
            var teams = _context.TraUserActivity
                .Where(p => p.EventId == eventId)
                    .Include(x => x.Activity)
                    .Include(x => x.Event)
                    .GroupBy(x => new { x.TeamId, x.EventId })
                    .Select(x => new TeamSpecificScoreDto()
                    {
                        score = x.Sum(y => y.Minutes * y.Activity.Intensity),
                        eventId = x.Key.EventId,
                        teamId = x.Key.TeamId
                    }).OrderByDescending(x => x.score)
                    .ToList().Take(number);

            return teams;


        }

        public IEnumerable<TeamSpecificScoreDto> TeamSpecificScore(int teamId)
        {
            var memberId = _context.TraUser.Where(x => x.TeamId == teamId).Select(x => x.UserId);
            var teamAct = _context.TraUserActivity
                .Where(p => memberId.Contains(p.UserId))
                    .Include(x => x.Activity)
                    .Include(x => x.Event).Where(x => x.Event.IsActive == true)
                    //.Where(x => x.Event.IsActive == true)
                    .GroupBy(x => new { x.TeamId, x.EventId })
                    .Select(x => new TeamSpecificScoreDto()
                    {
                        score = x.Sum(y => y.Minutes * y.Activity.Intensity),
                        eventId = x.Key.EventId,
                        teamId = teamId
                    })
                    .ToList();



            return teamAct;
        }

        public IEnumerable<UserScoreDto> CurrentUserScore(int id)
        {
            var userAct = _context.TraUserActivity
                .Where(p => p.UserId == id)
                    .Include(x => x.Activity)//.Where(x => x.Event.IsActive == true)
                    .Include(x => x.Event).Where(x => x.Event.IsActive == true)
                    .GroupBy(x => new { x.TeamId, x.EventId })
                    .Select(x => new UserScoreDto()
                    {
                        Score = x.Sum(y => y.Minutes * y.Activity.Intensity),
                        EventId = x.Key.EventId,
                        UserId = id,

                    })
                    .ToList();



            return userAct;
        }

        public IEnumerable<RegionScoreDto> RegionalScore(int eventId)
        {
            var teamAct = _context.TraUserActivity
                .Where(p => p.EventId == eventId)
                    .Include(x => x.Activity)
                    .Include(x => x.Event)
                    .Include(x => x.Team)
                    .GroupBy(x => new { x.Team.RegionId, x.EventId })
                    .Select(x => new RegionScoreDto
                    {
                        score = x.Sum(y => y.Minutes * y.Activity.Intensity),//.Sum(y => y.score),      
                        EventId = x.Key.EventId,
                        RegionId = x.Select(c => c.Team.RegionId).FirstOrDefault()
                    });

            //var result = new RegionScoreDto
            //{
            //    EventId = eventId,
            //    RegionId = z,
            //    score = teamAct
            //};



            return teamAct;
        }
        /*-----------------------------------------------------------------------------------------------------------------------------*/

        public IEnumerable<TraRole> GetRoles()
        {
            return _context.TraRole.OrderBy(c => c.RoleId).ToList();
        }

        public TraRole GetRole(int id)
        {
            return _context.TraRole.FirstOrDefault(c => c.RoleId == id);
        }

        public void CreateRole(TraRole traRole)
        {
            _context.TraRole.Add(traRole);
        }

        public bool RoleExists(string Name)
        {
            var checkRole = _context.TraRole.FirstOrDefault(c => c.Name == Name);
            if (checkRole != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        /*-----------------------------------------------------------------------------------------------------------------------------*/

        public IEnumerable<TraMemberReq> GetRequests()
        {
            return _context.TraMemberReq.OrderBy(c => c.MemberReqId).ToList();
        }

        public TraMemberReq GetRequest(int id)
        {
            return _context.TraMemberReq.FirstOrDefault(c => c.MemberReqId == id);
        }

        public void CreateRequest(TraMemberReq traMember)
        {
            _context.TraMemberReq.Add(traMember);
        }

        public IEnumerable<CurrentTeamRequestsDto> CurrentTeamReq(int teamId)
        {
            var teamRequests = _context.TraMemberReq
                .Where(p => p.TeamId == teamId)
                .Where(p => p.IsActive == true)
                    .Select(x => new CurrentTeamRequestsDto()
                    {
                        MemberReqId = x.MemberReqId,
                        TeamId = teamId,
                        UserId = x.UserId,
                        IsActive = x.IsActive
                    })
                    .ToList();



            return teamRequests;
        }


    }
}
