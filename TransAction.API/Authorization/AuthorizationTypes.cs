using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TransAction.API.Authorization
{
    public sealed class AuthorizationTypes
    {
        public const string TRA_CLAIM_TYPE = "TRA_CLAIM_TYPE";

        public const string EDIT_USER_POLICY = "EDIT_USER_POLICY";

        public const string EDIT_TEAM_POLICY = "EDIT_TEAM_POLICY";

        public const string TEAM_ID_CLAIM = "TEAM_ID_CLAIM";

        public const string USER_ID_CLAIM = "USER_ID_CLAIM";

        public const string LOGIN_CLAIM = "LOGIN_CLAIM";

        public const string EDIT_TEAM_CLAIM = "EDIT_TEAM_CLAIM";

        public const string ADMIN_CLAIM = "ADMIN_CLAIM";
    }
}
