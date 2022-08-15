using Microsoft.AspNetCore.Http;
using System;

namespace TransAction.API.Helpers
{
    public class UserHelper
    {
        public static string GetUserGuid(IHttpContextAccessor httpContextAccessor)
        {
            string userGuid = httpContextAccessor.HttpContext.User.FindFirst("idir_user_guid").Value;

            return userGuid;
        }


    }
}
