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
                    // Not sure why setting this to true isn't working.
                    ValidateAudience = false,
                    ValidAudience = configOptions.Audience,
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
                        var dbUser = db.GetUser(principal.FindFirstValue("idir_guid"));

                        if (dbUser == null)
                        {
                            // create user here
                            var newUser = new TraUser();
                            newUser.Username = principal.FindFirstValue("preferred_username");                            
                            var dir = principal.FindFirstValue("preferred_username").Split("@");
                            if(dir.Count() > 1)
                            {
                                newUser.Directory = dir[1];
                            }else
                            {
                                newUser.Directory = "";
                            }                                                       
                            newUser.RoleId = db.GetRole("USER").RoleId;

                            newUser.Email = principal.FindFirstValue(ClaimTypes.Email);
                            var fullName = principal.FindFirstValue("idir_displayName").Split(",");
                            newUser.Lname = fullName[0];
                            var firstName = fullName[1].TrimStart();
                            newUser.Fname = firstName.Remove(firstName.LastIndexOf(" "));
                            //newUser.Fname = principal.FindFirstValue(ClaimTypes.GivenName);
                            //newUser.Lname = principal.FindFirstValue(ClaimTypes.Surname);
                            newUser.Description = "Hello, I'm new to TransAction";
                            newUser.Guid = principal.FindFirstValue("idir_guid");
                            newUser.RegionId = db.GetRegion("HQ").RegionId;


                            db.CreateUser(newUser);
                            if (!db.Save())
                            {                                
                                context.NoResult();

                                context.Response.StatusCode = 500;
                                context.Response.ContentType = "text/plain";                               

                                return context.Response.WriteAsync("Unable to create new user in the database");

                            }

                        } else
                        {
                            // 
                            // TODO handle user create exceptions
                            //

                            List<Claim> claims = new List<Claim>();

                            switch (dbUser.Role.Name.ToLower())
                            {
                                //case "team_lead":
                                //    claims.Add(new Claim(AuthorizationTypes.TRA_CLAIM_TYPE, AuthorizationTypes.EDIT_TEAM_CLAIM));
                                //    break;
                                case "admin":
                                    //claims.Add(new Claim(AuthorizationTypes.TRA_CLAIM_TYPE, AuthorizationTypes.EDIT_TEAM_CLAIM));
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
