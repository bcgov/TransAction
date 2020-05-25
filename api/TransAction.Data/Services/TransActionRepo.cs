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
        //private TransActionContext _context;
        //public TransActionRepo(TransActionContext context)
        //{
        //    _context = context;
        //}

        //public TraUser GetUser(int id)
        //{
        //    return _context.TraUser.FirstOrDefault(c => c.UserId == id);
        //}

        //public IEnumerable<TraUser> GetUsers()
        //{
        //    return _context.TraUser.OrderBy(c => c.UserId).Include(x => x.TraImage).ToList();
        //}



        //public void CreateUser(TraUser traUser)
        //{
        //    _context.TraUser.Add(traUser);
        //}

        //public bool UserExists(string Name, string Email)
        //{
        //    var checkUser = _context.TraUser.FirstOrDefault(c => c.Username == Name || c.Email == Email);
        //    if (checkUser != null)
        //    {
        //        return true;
        //    }
        //    else
        //    {
        //        return false;
        //    }
        //}

        //public TraUser GetCurrentUser(string guid)
        //{
        //    return _context.TraUser.Include(x => x.Role).Include(x => x.TraImage).FirstOrDefault(c => c.Guid == guid);
        //}


        //public bool Save()
        //{
        //    return (_context.SaveChanges() >= 0);
        //}
        /*-----------------------------------------------------------------------------------------------------------------------------*/

        //public IEnumerable<TraTeam> GetTeams(int page, int pageSize)
        //{

        //    if (--page < 0) page = 0;
        //    return _context.TraTeam.Skip(page * pageSize).Take(pageSize).Include(x => x.TraImage).OrderBy(c => c.Name).ToList();

        //}
        //public IEnumerable<TraTeam> GetTeams()
        //{
        //    return _context.TraTeam.Include(x => x.TraImage).OrderBy(c => c.TeamId).ToList();

        //}
        //public TraTeam GetTeam(int id)
        //{
        //    return _context.TraTeam.Include(x => x.TraImage).FirstOrDefault(c => c.TeamId == id);
        //}

        //public void CreateTeam(TraTeam traTeam)
        //{
        //    _context.TraTeam.Add(traTeam);
        //}

        //public bool TeamExists(string Name)
        //{
        //    var checkTeam = _context.TraTeam.FirstOrDefault(c => c.Name == Name);
        //    if (checkTeam != null)
        //    {
        //        return true;
        //    }
        //    else
        //    {
        //        return false;
        //    }
        //}
        /*-----------------------------------------------------------------------------------------------------------------------------*/
        //public IEnumerable<TraRegion> GetRegions()
        //{
        //    return _context.TraRegion.OrderBy(c => c.RegionId).ToList();
        //}

        //public TraRegion GetRegion(int id)
        //{
        //    return _context.TraRegion.FirstOrDefault(c => c.RegionId == id);
        //}

        //public bool RegionExists(string Name)
        //{
        //    var checkRegion = _context.TraRegion.FirstOrDefault(c => c.Name == Name);
        //    if (checkRegion != null)
        //    {
        //        return true;
        //    }
        //    else
        //    {
        //        return false;
        //    }
        //}
        //public void CreateRegion(TraRegion traRegion)
        //{
        //    _context.TraRegion.Add(traRegion);
        //}

        /*-----------------------------------------------------------------------------------------------------------------------------*/

        //public IEnumerable<TraActivity> GetActivities()
        //{
        //    return _context.TraActivity.OrderBy(c => c.ActivityId).ToList();
        //}

        //public TraActivity GetActivity(int id)
        //{
        //    return _context.TraActivity.FirstOrDefault(c => c.ActivityId == id);
        //}

        //public bool ActivityExists(string Name)
        //{
        //    var checkActivity = _context.TraActivity.FirstOrDefault(c => c.Name == Name);
        //    if (checkActivity != null)
        //    {
        //        return true;
        //    }
        //    else
        //    {
        //        return false;
        //    }
        //}

        //public void CreateActivity(TraActivity traActivity)
        //{
        //    _context.TraActivity.Add(traActivity);
        //}

        //public IEnumerable<TraUserActivity> GetUserActivities()
        //{
        //    return _context.TraUserActivity.OrderBy(c => c.UserActivityId).ToList();
        //}

        //public TraUserActivity GetUserActivity(int id)
        //{
        //    return _context.TraUserActivity.FirstOrDefault(c => c.UserActivityId == id);
        //}

        //public bool UserActivityExists(string Name)
        //{
        //    var checkUserActivity = _context.TraUserActivity.FirstOrDefault(c => c.Name == Name);
        //    if (checkUserActivity != null)
        //    {
        //        return true;
        //    }
        //    else
        //    {
        //        return false;
        //    }
        //}

        //public void CreateUserActivity(TraUserActivity traUserActivity)
        //{
        //    _context.TraUserActivity.Add(traUserActivity);
        //}
        /*-----------------------------------------------------------------------------------------------------------------------------*/
        //public int EventSpecificScore(int eventId)
        //{

        //    var userAct = _context.TraUserActivity
        //        .Where(p => p.EventId == eventId)
        //            .Include(x => x.Activity)
        //            .GroupBy(x => new { x.EventId })
        //            .Select(x => new
        //            {
        //                Score = x.Sum(y => y.Minutes * y.Activity.Intensity)
        //            }).Select(c => c.Score).Sum();

        //    return userAct;

        //}

        //public int UserSpecificScore(int userId, int eventId)
        //{
        //    var userAct = _context.TraUserActivity
        //        .Where(p => p.EventId == eventId && p.UserId == userId)
        //            .Include(x => x.Activity)
        //            .Include(x => x.Event)
        //            .GroupBy(x => new { x.UserId, x.EventId })
        //            .Select(x => new
        //            {
        //                Score = x.Sum(y => y.Minutes * y.Activity.Intensity)
        //            }).Select(c => c.Score).Sum();

        //    return userAct;

        //}

        //public int TeamEventSpecificScore(int teamId, int eventId)
        //{
        //    var userAct = _context.TraUserActivity
        //        .Where(p => p.EventId == eventId && p.TeamId == teamId)
        //            .Include(x => x.Activity)
        //            .GroupBy(x => new { x.TeamId, x.EventId })
        //            .Select(x => new
        //            {
        //                Score = x.Sum(y => y.Minutes * y.Activity.Intensity)
        //            }).Select(c => c.Score).Sum();

        //    return userAct;
        //}

        //public IEnumerable<TeamSpecificScoreDto> TopTeams(int number, int eventId)
        //{
        //    var teams = _context.TraUserActivity
        //        .Where(p => p.EventId == eventId)
        //            .Include(x => x.Activity)
        //            .Include(x => x.Event)
        //            .GroupBy(x => new { x.TeamId, x.EventId })
        //            .Select(x => new TeamSpecificScoreDto()
        //            {
        //                score = x.Sum(y => y.Minutes * y.Activity.Intensity),
        //                eventId = x.Key.EventId,
        //                teamId = x.Key.TeamId
        //            }).OrderByDescending(x => x.score)
        //            .ToList().Take(number);

        //    return teams;


        //}

        //public IEnumerable<TeamSpecificScoreDto> TeamSpecificScore(int teamId)
        //{
        //    var memberId = _context.TraUser.Where(x => x.TeamId == teamId).Select(x => x.UserId);
        //    var teamAct = _context.TraUserActivity
        //        .Where(p => memberId.Contains(p.UserId))
        //            .Include(x => x.Activity)
        //            .Include(x => x.Event).Where(x => x.Event.IsActive == true)
        //            //.Where(x => x.Event.IsActive == true)
        //            .GroupBy(x => new { x.TeamId, x.EventId })
        //            .Select(x => new TeamSpecificScoreDto()
        //            {
        //                score = x.Sum(y => y.Minutes * y.Activity.Intensity),
        //                eventId = x.Key.EventId,
        //                teamId = teamId
        //            })
        //            .ToList();



        //    return teamAct;
        //}

        //public IEnumerable<UserScoreDto> CurrentUserScore(int id)
        //{
        //    var userAct = _context.TraUserActivity
        //        .Where(p => p.UserId == id)
        //            .Include(x => x.Activity)//.Where(x => x.Event.IsActive == true)
        //            .Include(x => x.Event).Where(x => x.Event.IsActive == true)
        //            .GroupBy(x => new { x.TeamId, x.EventId })
        //            .Select(x => new UserScoreDto()
        //            {
        //                Score = x.Sum(y => y.Minutes * y.Activity.Intensity),
        //                EventId = x.Key.EventId,
        //                UserId = id,

        //            })
        //            .ToList();



        //    return userAct;
        //}

        //public IEnumerable<RegionScoreDto> RegionalScore(int eventId)
        //{

        //    var regionScores = _context.TraUserActivity
        //        .Include(userActivity => userActivity.User)
        //            .ThenInclude(user => user.Team)
        //        .Include(userActivity => userActivity.Activity)
        //        .Where(userActivity => userActivity.EventId == eventId && userActivity.User.Team != null)
        //        .GroupBy(userActivity => userActivity.User.Team.RegionId)
        //        .Select(g => new RegionScoreDto
        //        {
        //            EventId = eventId,
        //            RegionId = g.Key,
        //            Score = g.Sum(x => x.Minutes * x.Activity.Intensity * 1000) / g.Select(x => x.UserId).Distinct().Count()
        //        })
        //        .ToList();

        //    var regions = _context.TraRegion.OrderBy(x => x.RegionId).ToList();
        //    var result = new List<RegionScoreDto>();

        //    foreach (var region in regions)
        //    {
        //        var score = regionScores.Where(x => x.RegionId == region.RegionId).FirstOrDefault();

        //        if (score != null)
        //        {
        //            result.Add(score);
        //        }
        //        else
        //        {
        //            result.Add(new RegionScoreDto { EventId = eventId, RegionId = region.RegionId, Score = 0 });
        //        }
        //    }

        //    return result;

        //}
        /*-----------------------------------------------------------------------------------------------------------------------------*/

        //public IEnumerable<TraRole> GetRoles()
        //{
        //    return _context.TraRole.OrderBy(c => c.RoleId).ToList();
        //}

        //public TraRole GetRole(int id)
        //{
        //    return _context.TraRole.FirstOrDefault(c => c.RoleId == id);
        //}

        //public void CreateRole(TraRole traRole)
        //{
        //    _context.TraRole.Add(traRole);
        //}

        //public bool RoleExists(string Name)
        //{
        //    var checkRole = _context.TraRole.FirstOrDefault(c => c.Name == Name);
        //    if (checkRole != null)
        //    {
        //        return true;
        //    }
        //    else
        //    {
        //        return false;
        //    }
        //}
        /*-----------------------------------------------------------------------------------------------------------------------------*/

        //public IEnumerable<TraMemberReq> GetRequests()
        //{
        //    return _context.TraMemberReq.Where(x => x.IsActive == true).OrderBy(c => c.MemberReqId).ToList();
        //}

        //public TraMemberReq GetRequest(int id)
        //{
        //    return _context.TraMemberReq.FirstOrDefault(c => c.MemberReqId == id);
        //}

        //public void CreateRequest(TraMemberReq traMember)
        //{
        //    _context.TraMemberReq.Add(traMember);
        //}

        //public IEnumerable<MemberReqDto> CurrentTeamReq(int teamId)
        //{
        //    var teamRequests = _context.TraMemberReq
        //        .Where(p => p.TeamId == teamId)
        //        .Where(p => p.IsActive == true)
        //            .Select(x => new MemberReqDto()
        //            {
        //                MemberReqId = x.MemberReqId,
        //                TeamId = teamId,
        //                UserId = x.UserId,
        //                IsActive = x.IsActive,
        //                ConcurrencyControlNumber = x.ConcurrencyControlNumber
        //            })
        //            .ToList();



        //    return teamRequests;
        //}
        /*...........................................................................................................*/
        //public IEnumerable<TraTopic> GetTopics()
        //{
        //    return _context.TraTopic
        //        .Include(x => x.TraTopicMessage)
        //            .ThenInclude(m => m.User);
        //}

        //public TraTopic GetTopic(int id)
        //{
        //    return _context.TraTopic.Include(x => x.TraTopicMessage).FirstOrDefault(c => c.TopicId == id);
        //}

        //public void CreateTopic(TraTopic traTopic)
        //{
        //    _context.TraTopic.Add(traTopic);
        //}

        //public bool TopicExists(string Title)
        //{
        //    var checkTopic = _context.TraTopic.FirstOrDefault(c => c.Title == Title);
        //    if (checkTopic != null)
        //    {
        //        return true;
        //    }
        //    else
        //    {
        //        return false;
        //    }
        //}

        //public IEnumerable<TraTopicMessage> GetTopicMessages(int topicId)
        //{
        //    return _context.TraTopicMessage
        //        .Include(x => x.Topic).Where(x => x.TopicId == topicId).OrderBy(c => c.TopicMessageId).ToList();

        //}


        //public IEnumerable<TraTopicMessage> GetMessages()
        //{
        //    return _context.TraTopicMessage.OrderBy(c => c.TopicMessageId).ToList();
        //}
        //public TraTopicMessage GetTopicMessage(int id)
        //{
        //    return _context.TraTopicMessage.FirstOrDefault(c => c.TopicMessageId == id);
        //}

        //public void CreateTopicMessage(TraTopicMessage traTopicMessage)
        //{
        //    _context.TraTopicMessage.Add(traTopicMessage);
        //}

        //public void DeleteTopicMessage(TraTopicMessage traTopicMessage)
        //{
        //    _context.TraTopicMessage.Remove(traTopicMessage);
        //}

        //public void DeleteTopic(TraTopic traTopic)
        //{
        //    _context.TraTopic.Remove(traTopic);
        //}

        //public TraImage GetUserProfileImage(int userId)
        //{
        //    return _context.TraImage.Where(x => x.UserId == userId).FirstOrDefault();
        //}

        //public TraImage GetTeamProfileImage(int teamId)
        //{
        //    return _context.TraImage.Where(x => x.TeamId == teamId).FirstOrDefault();
        //}

        //public TraImage GetProfileImage(string guid)
        //{
        //    return _context.TraImage.Where(x => x.Guid == guid).FirstOrDefault();
        //}

        //public void AddProfileImage(TraImage image)
        //{
        //    _context.TraImage.Add(image);
        //}


    }
}


