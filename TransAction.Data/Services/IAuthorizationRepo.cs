using TransAction.Data.Models;

namespace TransAction.Data.Services
{
    public interface IAuthorizationRepo
    {
        void CreateUser(TraUser user);
        TraUser GetUser(string username);
        bool Save();
    }
}

