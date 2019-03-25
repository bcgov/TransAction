using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace TransAction.API.Authorization
{
    public class ClaimRequirementAttribute : TypeFilterAttribute
    {
        public ClaimRequirementAttribute(string claimValue) : base(typeof(ClaimRequirementFilter))
        {
            Arguments = new object[] { new Claim(AuthorizationTypes.TRA_CLAIM_TYPE, claimValue) };
        }
    }

    public class ClaimRequirementFilter : IAuthorizationFilter
    {
        readonly Claim _claim;

        public ClaimRequirementFilter(Claim claim)
        {
            _claim = claim;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var hasClaim = context.HttpContext.User.Claims.Any(c => c.Type == _claim.Type && c.Value == _claim.Value);
            if (!hasClaim)
            {

                context.Result = new UnauthorizedResult();

                HttpResponse response = context.HttpContext.Response;

                string responseText = "Insufficient permission";
                byte[] data = Encoding.UTF8.GetBytes(responseText);

                response.StatusCode = 403; // forbidden
                response.Body.Write(data, 0, data.Length);
                response.Body.FlushAsync();
            }
        }
    }
}
