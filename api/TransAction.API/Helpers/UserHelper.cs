using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TransAction.Data.Services;

namespace TransAction.API.Helpers
{
    public class UserHelper
    {



        public static string GetUserGuid(IHttpContextAccessor httpContextAccessor)
        {
            String userGuid = httpContextAccessor.HttpContext.User.FindFirst("idir_guid").Value;

            return userGuid;
        }


    }
}
