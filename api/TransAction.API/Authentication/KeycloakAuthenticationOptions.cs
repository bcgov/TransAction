using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TransAction.API.Authentication
{
    public class KeycloakAuthenticationOptions
    {
        public string Authority { get; set; }

        public string Audience { get; set; }
    }
}
