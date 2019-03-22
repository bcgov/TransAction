using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TransAction.Data.Models;

namespace TransAction.API.Authentication
{
    public static class KeycloakAuthenticationExtensions
    {
        public static AuthenticationBuilder AddKeycloakAuth(this AuthenticationBuilder builder)
        {
            return builder.AddJwtBearer(o =>
            {
                o.Authority = "http://localhost:8080/auth/realms/dev";
                o.Audience = "dev-client";
                o.RequireHttpsMetadata = false;
                o.IncludeErrorDetails = true;

                o.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateAudience = false,
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidIssuer = "http://localhost:8080/auth/realms/dev",
                    ValidateLifetime = true
                };

                o.Events = new JwtBearerEvents()
                {
                    OnAuthenticationFailed = context =>
                    {
                        context.NoResult();

                        context.Response.StatusCode = 500;
                        context.Response.ContentType = "text/plain";

                        return context.Response.WriteAsync(context.Exception.ToString());
                    },
                    OnTokenValidated = context =>
                    {
                        var username = context.Principal.FindFirstValue("preferred_username");
                        var db = context.HttpContext.RequestServices.GetRequiredService<TransActionContext>();
                        var user = db.TraUser.FirstOrDefault(x => x.Username == username);

                        var claims = new List<Claim>
                        {
                            new Claim("ConfidentialAccess", "true"),
                            new Claim("ConfidentialAccess2", "true")
                        };
                        var appIdentity = new ClaimsIdentity(claims);

                        context.Principal.AddIdentity(appIdentity);
                        return Task.CompletedTask;
                    }
                };
            });
        }
    }
}
