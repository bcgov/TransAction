using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TransAction.API.Authorization;
using TransAction.Data.Models;
using TransAction.Data.Services;

namespace TransAction.API.Authentication
{
    public static class KeycloakAuthenticationExtensions
    {
        public static AuthenticationBuilder AddKeycloakAuth(this AuthenticationBuilder builder, KeycloakAuthenticationOptions configOptions)
        {            
            return builder.AddJwtBearer(o =>
            {
                o.Authority = configOptions.Authority;
                o.Audience = configOptions.Audience;
                o.RequireHttpsMetadata = false;
                o.IncludeErrorDetails = true;

                o.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateAudience = false,
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidIssuer = configOptions.Authority,
                    ValidateLifetime = true
                };

                o.Events = new JwtBearerEvents()
                {
                    OnAuthenticationFailed = context =>
                    {
                        IHostingEnvironment env = context.HttpContext.RequestServices.GetRequiredService<IHostingEnvironment>();
                        context.NoResult();

                        context.Response.StatusCode = 500;
                        context.Response.ContentType = "text/plain";

                        if (env.IsDevelopment())
                        {
                            return context.Response.WriteAsync(context.Exception.ToString());
                        }

                        return context.Response.WriteAsync("An error occured processing your authentication.");
                    },
                    OnTokenValidated = context =>
                    {
                        var principal = context.Principal;
                        var db = context.HttpContext.RequestServices.GetRequiredService<IAuthorizationRepo>();
                        var dbUser = db.GetUser(principal.FindFirstValue("preferred_username"));

                        if (dbUser == null)
                        {
                            // create user here
                        } else
                        {
                            // 
                            // TODO handle user create exceptions
                            //

                            List<Claim> claims = new List<Claim>();

                            switch (dbUser.Role.Name)
                            {
                                case "teamlead":
                                    claims.Add(new Claim(AuthorizationTypes.TRA_CLAIM_TYPE, AuthorizationTypes.EDIT_TEAM_CLAIM));
                                    break;
                                case "admin":
                                    claims.Add(new Claim(AuthorizationTypes.TRA_CLAIM_TYPE, AuthorizationTypes.EDIT_TEAM_CLAIM));
                                    claims.Add(new Claim(AuthorizationTypes.TRA_CLAIM_TYPE, AuthorizationTypes.ADMIN_CLAIM));
                                    break;
                                default:
                                    claims.Add(new Claim(AuthorizationTypes.TRA_CLAIM_TYPE, AuthorizationTypes.LOGIN_CLAIM));
                                    break;
                            }

                            if (dbUser.Team != null)
                                claims.Add(new Claim(AuthorizationTypes.TEAM_ID_CLAIM, dbUser.Team.TeamId.ToString()));

                            claims.Add(new Claim(AuthorizationTypes.USER_ID_CLAIM, dbUser.UserId.ToString()));

                            var appIdentity = new ClaimsIdentity(claims);

                            principal.AddIdentity(appIdentity);
                        }
                        
                        return Task.CompletedTask;
                    }
                };
            });
        }
    }
}
