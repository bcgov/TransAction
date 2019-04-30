using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TransAction.API.Authorization
{
    public class UserEditAuthorizationHandler :
        AuthorizationHandler<UserEditRequirement, int>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
                                                       UserEditRequirement requirement,
                                                       int userId)
        {
            if (context.User.HasClaim(c => c.Type == AuthorizationTypes.TRA_CLAIM_TYPE && c.Value == AuthorizationTypes.ADMIN_CLAIM))
            {
                context.Succeed(requirement);
            }

            if (context.User.HasClaim(c => c.Type == AuthorizationTypes.USER_ID_CLAIM && c.Value == userId.ToString()))
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }

    public class UserEditRequirement : IAuthorizationRequirement { }
}
