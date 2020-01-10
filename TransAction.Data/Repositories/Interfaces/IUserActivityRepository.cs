using System.Collections.Generic;
using TransAction.Data.Models;

namespace TransAction.Data.Repositories.Interfaces
{
    public interface IUserActivityRepository
    {
        IEnumerable<TraUserActivity> GetAll(int page, int pageSize);
        IEnumerable<TraUserActivity> GetAllByEventUser(int eventId, int userId);
        void Create(TraUserActivity newUserActivity);
        void Update(TraUserActivity updateUserActivity);
        void Delete(TraUserActivity userActivity);
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
