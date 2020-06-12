using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
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

                o.Events = new JwtBearerEvents()
                {
                    OnAuthenticationFailed = context =>
                    {
                        var env = context.HttpContext.RequestServices.GetRequiredService<IWebHostEnvironment>();
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
                            if (dir.Count() > 1)
                            {
                                newUser.Directory = dir[1];
                            }
                            else
                            {
                                newUser.Directory = "";
                            }
                            newUser.RoleId = db.GetRole("USER").RoleId;

                            newUser.Email = principal.FindFirstValue(ClaimTypes.Email);
                            var fullName = principal.FindFirstValue("idir_displayName").Split(",");
                            newUser.Lname = fullName[0];
                            var firstName = fullName[1].TrimStart();
                            newUser.Fname = firstName.Remove(firstName.LastIndexOf(" "));
                            newUser.Description = "Hello, I'm new to TransAction";
                            newUser.Guid = principal.FindFirstValue("idir_guid");
                            newUser.RegionId = db.GetRegion("HQ").RegionId;
                            newUser.IsFreeAgent = false;


                            db.CreateUser(newUser);
                            if (!db.Save())
                            {
                                context.NoResult();

                                context.Response.StatusCode = 500;
                                context.Response.ContentType = "text/plain";

                                return context.Response.WriteAsync("Unable to create new user in the database");

                            }

                        }
                        else
                        {
                            List<Claim> claims = new List<Claim>();

                            switch (dbUser.Role.Name.ToLower())
                            {
                                case "admin":
                                    claims.Add(new Claim(AuthorizationTypes.TRA_CLAIM_TYPE, AuthorizationTypes.ADMIN_CLAIM));
                                    break;
                                default:
                                    claims.Add(new Claim(AuthorizationTypes.TRA_CLAIM_TYPE, AuthorizationTypes.LOGIN_CLAIM));
                                    break;
                            }

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
