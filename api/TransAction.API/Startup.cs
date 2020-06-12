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
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using System.Text.Json;
using Newtonsoft.Json;
using TransAction.API.Authentication;
using TransAction.API.Extensions;
using TransAction.Data.Models;
using TransAction.Data.Repositories;
using TransAction.Data.Repositories.Interfaces;
using TransAction.Data.Services;
using Microsoft.CodeAnalysis.Options;
using TransAction.API.Helpers;

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

            services.AddControllers(options =>
            {
                options.Filters.Add(new AuthorizeFilter(new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build()));
            })
            .SetCompatibilityVersion(CompatibilityVersion.Version_3_0)
            .AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.Converters.Add(new TrimmingConverter());
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
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
            app.UseRouting();
            app.UseAuthentication();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
