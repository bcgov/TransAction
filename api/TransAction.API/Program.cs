using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.IdentityModel.Logging;
using Serilog;
using System;
using System.IO;
using TransAction.API.Authentication;
using TransAction.Data.Models;
using TransAction.Data.Repositories.Interfaces;
using TransAction.Data.Repositories;
using TransAction.Data.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Authorization;
using TransAction.API.Helpers;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using TransAction.API.Extensions;
using System.Linq;
using Microsoft.AspNetCore.Http;
using System.Net.Mime;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

var configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"}.json", optional: true)
    .AddEnvironmentVariables()
    .Build();

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(configuration)
    .CreateLogger();

// Only used for app.ConfigureExceptionHandler() 
var loggerFactory = new LoggerFactory().AddSerilog(Log.Logger);
var logger = loggerFactory.CreateLogger("Logger");

var builder = WebApplication.CreateBuilder(args);

// Register services here
builder.Host.UseSerilog(Log.Logger);
builder.Services.AddHttpContextAccessor();
builder.Services.AddAutoMapper(typeof(Program).Assembly);
builder.Services.AddScoped<ITransActionRepo, TransActionRepo>();
builder.Services.AddScoped<IAuthorizationRepo, AuthorizationRepo>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

var ConnectionString = configuration["CONNECTION_STRING"];
builder.Services.AddDbContext<TransActionContext>(opt =>
    opt.UseSqlServer(ConnectionString));
IdentityModelEventSource.ShowPII = true;

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddKeycloakAuth(new KeycloakAuthenticationOptions()
        {
            Authority = configuration["JWT_AUTHORITY"],
            Audience = configuration["JWT_AUDIENCE"]
        }
    );

builder.Services.AddControllers(options =>
{
    options.Filters.Add(
        new AuthorizeFilter(
            new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .Build()
        )
    );
}).AddNewtonsoftJson(options =>
{
    options.SerializerSettings.Converters.Add(new TrimmingConverter());
});

builder.Services.AddHealthChecks().AddSqlServer(
    ConnectionString, 
    name: "DB-Check", 
    failureStatus: HealthStatus.Degraded, 
    tags: new string[] { "sql", "db" }
);

var app = builder.Build();

// Use services here
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseSerilogRequestLogging();
app.ConfigureExceptionHandler(logger);

var healthCheckOptions = new HealthCheckOptions
{
    ResponseWriter = async (c, r) =>
    {
        c.Response.ContentType = MediaTypeNames.Application.Json;
        var result = System.Text.Json.JsonSerializer.Serialize(
            new {
                checks = r.Entries.Select(e =>
                    new {
                        description = e.Key,
                        status = e.Value.Status.ToString(),
                        tags = e.Value.Tags,
                        responseTime = e.Value.Duration.TotalMilliseconds
                    }
                ),
                totalResponseTime = r.TotalDuration.TotalMilliseconds
            }
        );
        await c.Response.WriteAsync(result);
    }
};

app.UseHealthChecks("/healthz", healthCheckOptions);
app.UseRouting();
app.UseAuthentication();
app.MapControllers();

app.Run();

/*
public class Program
{
    public static IConfiguration Configuration { get; } = new ConfigurationBuilder()
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
        .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"}.json", optional: true)
        .AddEnvironmentVariables()
        .Build();

    public static int Main(string[] args)
    {
        Log.Logger = new LoggerConfiguration()
            .ReadFrom.Configuration(Configuration)
            .CreateLogger();

        try
        {
            Log.Information("Starting web host");
            CreateHostBuilder(args).Build().Run();
            return 0;
        }
        catch (Exception ex)
        {
            Log.Fatal(ex, "Host terminated unexpectedly");
            return 1;
        }
        finally
        {
            Log.CloseAndFlush();
        }
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
            })
            .UseSerilog();
}
*/