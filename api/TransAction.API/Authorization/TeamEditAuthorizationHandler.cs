using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TransAction.API.Authorization
{
    public class TeamEditAuthorizationHandler :
    AuthorizationHandler<TeamEditRequirement, int>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
                                                       TeamEditRequirement requirement,
                                                       int teamId)
        {
            if (context.User.HasClaim(c => c.Type == AuthorizationTypes.TRA_CLAIM_TYPE && c.Value == AuthorizationTypes.ADMIN_CLAIM))
            {
                context.Succeed(requirement);
            }

            if (context.User.HasClaim(c => c.Type == AuthorizationTypes.TRA_CLAIM_TYPE && c.Value == AuthorizationTypes.EDIT_TEAM_CLAIM) &&
                context.User.HasClaim(c => c.Type == AuthorizationTypes.TEAM_ID_CLAIM && c.Value == teamId.ToString()))
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }

    public class TeamEditRequirement : IAuthorizationRequirement { }

}
