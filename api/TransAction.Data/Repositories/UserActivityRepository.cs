﻿using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using TransAction.Data.Models;
using TransAction.Data.Repositories.Interfaces;

namespace TransAction.Data.Repositories
{
    public class UserActivityRepository : RepositoryBase<TraUserActivity>, IUserActivityRepository
    {
        public UserActivityRepository(TransActionContext context) : base(context)
        {
        }


        public IEnumerable<UserScoreDto> CurrentUserScore(int id)
        {
            var userAct = Find()
                .Where(p => p.UserId == id)
                    .Include(x => x.Activity)//.Where(x => x.Event.IsActive == true)
                    .Include(x => x.Event).Where(x => x.Event.IsActive == true)
                    .GroupBy(x => new { x.TeamId, x.EventId })
                    .Select(x => new UserScoreDto()
                    {
                        Score = x.Sum(y => y.Minutes * y.Activity.Intensity),
                        EventId = x.Key.EventId,
                        UserId = id,
                        EventName = x.Select(y => y.Event.Name).FirstOrDefault()
                    })
                    .ToList();



            return userAct;
        }

        public int EventSpecificScore(int eventId)
        {
            var userAct = Find()
                .Where(p => p.EventId == eventId)
                    .Include(x => x.Activity)
                    .GroupBy(x => new { x.EventId })
                    .Select(x => new
                    {
                        Score = x.Sum(y => y.Minutes * y.Activity.Intensity)
                    }).Select(c => c.Score).Sum();

            return userAct;
        }

        public int Count()
        {
            return FindAll().OrderBy(c => c.UserActivityId).Count();
        }

        public IEnumerable<TraUserActivity> GetAll(int page, int pageSize)
        {
            if (--page < 0) page = 0;
            return FindAll().OrderBy(c => c.UserActivityId).Skip(page * pageSize).Take(pageSize).ToList();
        }

        public IEnumerable<TraUserActivity> GetAllByEventUser(int eventId, int userId)
        {
            return Find(x => x.EventId == eventId && x.UserId == userId).ToList();
        }

        public TraUserActivity GetUserActivity(int id)
        {
            return Find(c => c.UserActivityId == id).FirstOrDefault();
        }

        public IEnumerable<RegionScoreDto> RegionalScore(int eventId)
        {
            var regionScores = Find()
                .Include(userActivity => userActivity.User)
                    .ThenInclude(user => user.Team)
                .Include(userActivity => userActivity.Activity)
                .Where(userActivity => userActivity.EventId == eventId && userActivity.User.Team != null)
                .GroupBy(userActivity => userActivity.User.Team.RegionId)
                .Select(g => new RegionScoreDto
                {
                    EventId = eventId,
                    RegionId = g.Key,
                    Score = g.Sum(x => x.Minutes * x.Activity.Intensity * 1000) / g.Select(x => x.UserId).Distinct().Count()
                })
                .ToList();

            var regions = _context.TraRegion.OrderBy(x => x.RegionId).ToList();
            var result = new List<RegionScoreDto>();

            foreach (var region in regions)
            {
                var score = regionScores.Where(x => x.RegionId == region.RegionId).FirstOrDefault();

                if (score != null)
                {
                    result.Add(score);
                }
                else
                {
                    result.Add(new RegionScoreDto { EventId = eventId, RegionId = region.RegionId, Score = 0 });
                }
            }

            return result;
        }

        public int TeamEventSpecificScore(IEnumerable<TraUser> users, int teamId, int eventId)
        {
            var userList = users.Select(x => x.UserId).ToList();
            var userAct = Find(p => p.EventId == eventId && userList.Contains(p.UserId))
                            .Include(x => x.Activity)
                            .GroupBy(x => new { x.TeamId, x.EventId })
                            .Select(x => new
                            {
                                Score = x.Sum(y => y.Minutes * y.Activity.Intensity)
                            }).Select(c => c.Score).Sum();

            return userAct;

        }

        public IEnumerable<TeamSpecificScoreDto> TeamSpecificScore(IEnumerable<TraUser> users, int teamId)
        {
            var userList = users.Select(x => x.UserId).ToList();
            var teamAct = Find(p => userList.Contains(p.UserId))
                            .Include(x => x.Activity)
                            .Include(x => x.Event).Where(x => x.Event.IsActive == true)
                            .GroupBy(x => new { x.TeamId, x.EventId })
                            .Select(x => new TeamSpecificScoreDto()
                            {
                                Score = x.Sum(y => y.Minutes * y.Activity.Intensity),
                                EventId = x.Key.EventId,
                                TeamId = teamId,
                                EventName = x.Select(y => y.Event.Name).FirstOrDefault()
                            })
                            .ToList();

            return teamAct;
        }

        public IEnumerable<TeamSpecificScoreDto> TopTeams(int number, int eventId)
        {
            var teams = Find(p => p.EventId == eventId)
                         .Include(x => x.Activity)
                         .Include(x => x.Event)
                         .GroupBy(x => new { x.TeamId, x.EventId })
                         .Select(x => new TeamSpecificScoreDto()
                         {
                             Score = x.Sum(y => y.Minutes * y.Activity.Intensity),
                             EventId = x.Key.EventId,
                             TeamId = x.Key.TeamId
                         }).OrderByDescending(x => x.Score).Take(number)
                         .ToList();

            return teams;
        }

        public int UserSpecificScore(int userId, int eventId)
        {
            var userAct = Find(p => p.EventId == eventId && p.UserId == userId)
                            .Include(x => x.Activity)
                            .Include(x => x.Event)
                            .GroupBy(x => new { x.UserId, x.EventId })
                            .Select(x => new
                            {
                                Score = x.Sum(y => y.Minutes * y.Activity.Intensity),
                            }).Select(c => c.Score).Sum();

            return userAct;
        }

        public int CountByActivityType(int activityId)
        {
            return Find(x => x.ActivityId == activityId).Count();
        }
    }
}
