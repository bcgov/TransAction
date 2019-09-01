using System.Collections.Generic;
using TransAction.Data.Models;

namespace TransAction.Data.Repositories.Interfaces
{
    public interface IUserActivityRepository
    {
        IEnumerable<TraUserActivity> GetAllUserActivities(int page, int pageSize);
        void Create(TraUserActivity newUserActivity);
        void Update(TraUserActivity updateUserActivity);
        TraUserActivity GetUserActivity(int id);
        int EventSpecificScore(int eventId);
        int UserSpecificScore(int userId, int eventId);
        IEnumerable<TeamSpecificScoreDto> TeamSpecificScore(IEnumerable<TraUser> users, int teamId);
        int TeamEventSpecificScore(IEnumerable<TraUser> users, int teamId, int eventId);
        IEnumerable<UserScoreDto> CurrentUserScore(int id);
        IEnumerable<TeamSpecificScoreDto> TopTeams(int number, int eventId);
        IEnumerable<RegionScoreDto> RegionalScore(int eventId);
        int Count();
        int CountByActivityType(int activityId);

    }
}
