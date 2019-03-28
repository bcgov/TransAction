using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
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

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //Adding services
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.AddScoped<ITransActionRepo, TransActionRepo>();


            var ConnectionString = @"Server=NC057936\SQLEXPRESS;Database=TransActionNew; Trusted_Connection = true";
            services.AddDbContext<TransActionContext>(opt =>
                opt.UseSqlServer(ConnectionString));
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
            app.UseStatusCodePages();
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
            app.UseMvc();
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseCookiePolicy();


        }
    }
}
