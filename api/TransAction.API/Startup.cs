using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Serilog;
using TransAction.API.Authentication;
using TransAction.API.Extensions;
using TransAction.API.Helpers;
using TransAction.Data.Models;
using TransAction.Data.Repositories;
using TransAction.Data.Repositories.Interfaces;
using TransAction.Data.Services;

namespace TransAction.API
{
    public class Startup
    {
        private readonly ILogger<Startup> _logger;

        public Startup(IConfiguration configuration, ILogger<Startup> logger)
        {
            Configuration = configuration;
            _logger = logger;
        }

        public IConfiguration Configuration { get; }

        private const string CORS_ALLOW_ALL = "CORS_ALLOW_ALL";

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //Adding services
            services.AddHttpContextAccessor();

            services.AddAutoMapper(typeof(Startup).Assembly);

            services.AddScoped<ITransActionRepo, TransActionRepo>();
            services.AddScoped<IAuthorizationRepo, AuthorizationRepo>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            var ConnectionString = Configuration["CONNECTION_STRING"];
            services.AddDbContext<TransActionContext>(opt =>
                opt.UseSqlServer(ConnectionString));

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddKeycloakAuth(new KeycloakAuthenticationOptions() { Authority = Configuration["JWT_AUTHORITY"], Audience = Configuration["JWT_AUDIENCE"] });

            services.AddCors(options =>
            {
                options.AddPolicy(CORS_ALLOW_ALL,
                builder =>
                {
                    builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
                });
            });

            services.AddMvc(options =>
            {
                options.Filters.Add(new AuthorizeFilter(new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build()));
            })
            .SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
            .AddJsonOptions(a => a.SerializerSettings.Converters.Add(new TrimmingConverter()));
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

            }

            app.UseSerilogRequestLogging();
            app.ConfigureExceptionHandler(_logger);

            app.UseCors(CORS_ALLOW_ALL);
            app.UseAuthentication();
            app.UseMvc();
        }
    }
}
