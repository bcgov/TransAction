using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Reflection;
using System.Runtime.Versioning;
using TransAction.Data.Models;

namespace TransAction.API.Controllers
{
    [Route("api/version")]
    public class VersionController : ControllerBase
    {
        private const string CommitKey = "OPENSHIFT_BUILD_COMMIT";
        private const string EnvironmentKey = "ASPNETCORE_ENVIRONMENT";

        private IConfiguration _config;

        public VersionController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet]
        public ActionResult<VersionInfo> GetVersionInfo()
        {
            var assembly = Assembly.GetExecutingAssembly();

            var creationTime = System.IO.File.GetLastWriteTimeUtc(assembly.Location);

            var versionInfo = new VersionInfo()
            {
                Name = assembly.GetName().Name,
                Version = assembly.GetCustomAttribute<AssemblyInformationalVersionAttribute>().InformationalVersion,
                Description = assembly.GetCustomAttribute<AssemblyDescriptionAttribute>().Description,
                Copyright = assembly.GetCustomAttribute<AssemblyCopyrightAttribute>().Copyright,
                FileVersion = assembly.GetCustomAttribute<AssemblyFileVersionAttribute>().Version,
                FileCreationTime = creationTime.ToString("O"),
                InformationalVersion = assembly.GetCustomAttribute<AssemblyInformationalVersionAttribute>().InformationalVersion,
                TargetFramework = assembly.GetCustomAttribute<TargetFrameworkAttribute>().FrameworkName,
                ImageRuntimeVersion = assembly.ImageRuntimeVersion,
                Commit = _config[CommitKey],
                Environment = _config[EnvironmentKey].ToLowerInvariant()
            };

            return Ok(versionInfo);
        }
    }
}
