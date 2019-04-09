using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TransAction.API.Authentication;
using TransAction.API.Authorization;
using TransAction.Data.Models;
using TransAction.Data.Services;

namespace TransAction.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        private const string CORS_ALLOW_ALL = "CORS_ALLOW_ALL";

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //Adding services
            
            // add http context accessor
            services.AddHttpContextAccessor();

            services.AddScoped<ITransActionRepo, TransActionRepo>();
            services.AddScoped<IAuthorizationRepo, AuthorizationRepo>();

            var ConnectionString = Configuration["CONNECTION_STRING"];
            services.AddDbContext<TransActionContext>(opt =>
                opt.UseSqlServer(ConnectionString));

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddKeycloakAuth(new KeycloakAuthenticationOptions() { Authority = Configuration["JWT_AUTHORITY"], Audience = Configuration["JWT_AUDIENCE"] });

            services.AddAuthorization(options =>
            {
                options.AddPolicy(AuthorizationTypes.EDIT_USER_POLICY, policy =>
                    policy.Requirements.Add(new UserEditRequirement()));
                options.AddPolicy(AuthorizationTypes.EDIT_TEAM_POLICY, policy =>
                    policy.Requirements.Add(new TeamEditRequirement()));
            });

            services.AddSingleton<IAuthorizationHandler, UserEditAuthorizationHandler>();
            services.AddSingleton<IAuthorizationHandler, TeamEditAuthorizationHandler>();

            services.AddCors(options =>
            {
                options.AddPolicy(CORS_ALLOW_ALL,
                builder =>
                {
                    builder.AllowAnyOrigin().AllowAnyHeader();

                });
            });

            services.AddMvc(options =>
            {
                options.Filters.Add(new AuthorizeFilter(new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build()));
            })
            .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler();
            }

            AutoMapper.Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<TraEvent, EventDto>();
                cfg.CreateMap<EventDto, TraEvent>();
                cfg.CreateMap<EventCreateDto, TraEvent>();
                cfg.CreateMap<EventUpdateDto, TraEvent>();
                cfg.CreateMap<TraEvent, EventUpdateDto>();

                // for profile 
                cfg.CreateMap<TraUser, UserDto>();
                cfg.CreateMap<UserDto, TraUser>();
                cfg.CreateMap<UserCreateDto, TraUser>();
                cfg.CreateMap<UserUpdateDto, TraUser>();
                cfg.CreateMap<TraUser, UserUpdateDto>();

                //for teams
                cfg.CreateMap<TraTeam, TeamDto>();
                cfg.CreateMap<TeamDto, TraTeam>();
                cfg.CreateMap<TeamCreateDto, TraTeam>();
                cfg.CreateMap<TeamUpdateDto, TraTeam>();
                cfg.CreateMap<TraTeam, TeamUpdateDto>();
            });

            app.UseCors(CORS_ALLOW_ALL);
            app.UseAuthentication();
            app.UseMvc();
        }
    }
}
