using System.Collections.Generic;
using TransAction.Data.Models;


namespace TransAction.Data.Repositories.Interfaces
{
    public interface IActivityRepository
    {
        IEnumerable<TraActivity> GetAll(int page, int pageSize);
        int GetCount();
        TraActivity GetById(int id);
        void Create(TraActivity newActivity);
        void Update(TraActivity updateActivity);
        void Delete(TraActivity activity);
        bool Exists(string Name, int intensity);
    }
}
