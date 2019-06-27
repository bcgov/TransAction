using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using TransAction.Data.Models;

namespace TransAction.Data.Services
{
    public interface ITransActionRepo
    {
        IEnumerable<TraUser> GetUsers();
        TraUser GetUser(int id);
        bool UserExists(string Name, string Email);
        void CreateUser(TraUser traUser);
        TraUser GetCurrentUser(string guid);

        //IEnumerable<TraTeam> GetTeamsBySize(int page, int pageSize);
        IEnumerable<TraTeam> GetTeams(int page, int pageSize);
        TraTeam GetTeam(int id);
        bool TeamExists(string Name);
        void CreateTeam(TraTeam traTeam);

        IEnumerable<TraRegion> GetRegions();
        TraRegion GetRegion(int id);
        bool RegionExists(string Name);
        void CreateRegion(TraRegion traRegion);

        IEnumerable<TraActivity> GetActivities();
        TraActivity GetActivity(int id);
        bool ActivityExists(string Name);
        void CreateActivity(TraActivity traActivity);

        IEnumerable<TraUserActivity> GetUserActivities();
        int EventSpecificScore(int eventId);
        int UserSpecificScore(int userId, int eventId);
        IEnumerable<TeamSpecificScoreDto> TeamSpecificScore(int teamId);
        int TeamEventSpecificScore(int teamId, int eventId);
        IEnumerable<UserScoreDto> CurrentUserScore(int id);
        TraUserActivity GetUserActivity(int id);
        bool UserActivityExists(string Name);
        void CreateUserActivity(TraUserActivity traUserActivity);
        IEnumerable<TeamSpecificScoreDto> TopTeams(int number, int eventId);
        IEnumerable<RegionScoreDto> RegionalScore(int eventId);


        IEnumerable<TraRole> GetRoles();
        TraRole GetRole(int id);
        void CreateRole(TraRole traRole);
        bool RoleExists(string Name);

        IEnumerable<TraMemberReq> GetRequests();
        TraMemberReq GetRequest(int id);
        void CreateRequest(TraMemberReq traMember);
        IEnumerable<MemberReqDto> CurrentTeamReq(int teamId);


        IEnumerable<TraTopic> GetTopics();
        TraTopic GetTopic(int id);
        void CreateTopic(TraTopic traTopic);
        bool TopicExists(string Title);
        void DeleteTopic(TraTopic traTopic);

        IEnumerable<TraTopicMessage> GetTopicMessages(int topicId);
        TraTopicMessage GetTopicMessage(int id);
        void CreateTopicMessage(TraTopicMessage traTopicMessage);
        void DeleteTopicMessage(TraTopicMessage traTopicMessage);
        IEnumerable<TraTopicMessage> GetMessages();

        TraImage GetProfileImage(string guid);
        TraImage GetUserProfileImage(int userId);
        TraImage GetTeamProfileImage(int teamId);
        void AddProfileImage(TraImage image);


        bool Save();
    }
}
