using Microsoft.EntityFrameworkCore;
using System.Linq;
using TransAction.Data.Models;

namespace TransAction.Data.Services
{
    public class AuthorizationRepo : IAuthorizationRepo
    {
        private TransActionContext _context;

        public AuthorizationRepo(TransActionContext context)
        {
            _context = context;
        }
        public TraUser GetUser(string username)
        {
            return _context.TraUser
                .Include(x => x.Role)
                .Include(x => x.Team)
                .FirstOrDefault(x => x.Username == username);
        }

        public void CreateUser(TraUser user)
        {
            if (string.IsNullOrEmpty(user.Username) || string.IsNullOrEmpty(user.Email))
                return;

            _context.TraUser.Add(user);
        }

        public bool Save()
        {
            return (_context.SaveChanges() >= 0);
        }
    }
}
