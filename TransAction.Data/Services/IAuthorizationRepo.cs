using TransAction.Data.Models;

namespace TransAction.Data.Services
{
    public interface IAuthorizationRepo
    {
        void CreateUser(TraUser user);
        TraUser GetUser(string guid);
        TraRole GetRole(string role);
        TraRegion GetRegion(string region);
        bool Save();
    }
}

