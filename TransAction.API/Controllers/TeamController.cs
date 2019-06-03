using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TransAction.API.Authorization;
using TransAction.API.Helpers;
using TransAction.Data.Models;
using TransAction.Data.Services;

namespace TransAction.API.Controllers
{
    [Route("api/teams")]
    public class TeamController : Controller
    {
        private ITransActionRepo _transActionRepo;
        private IHttpContextAccessor _httpContextAccessor;
        private IMapper _mapper;

        public TeamController(ITransActionRepo transActionRepo, IHttpContextAccessor httpContextAccessor, IMapper mapper)
        {
            _transActionRepo = transActionRepo;
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
        }


        [HttpGet()]
        public IActionResult GetTeams()
        {
            var teams = _transActionRepo.GetTeams();
         
            var getTeams = _mapper.Map<IEnumerable<TeamDto>>(teams);
            var users = _transActionRepo.GetUsers();
            foreach (var team in getTeams)
            {                
                var members = users.Where(y => y.TeamId == team.TeamId);
                team.NumMembers = members.Count();
                team.TeamMemberIds = members.Select(x => x.UserId).ToArray();
                
            }
            var resultTeams = getTeams.Where(x => x.NumMembers > 0);
            return Ok(resultTeams);
        }

        [HttpGet("{id}", Name = "GetThatTeam")]
        public IActionResult GetTeam(int id)
        {
            try
            {
                var getTeams = _transActionRepo.GetTeams().FirstOrDefault(c => c.TeamId == id);

                if (getTeams == null)
                {
                    return NotFound();
                }
                var getTeam = _transActionRepo.GetTeam(id);
                var users = _transActionRepo.GetUsers();
                var members = users.Where(x => x.TeamId == id);                
                var getTeamResult = _mapper.Map<TeamDto>(getTeam);
                getTeamResult.NumMembers = members.Count();
                getTeamResult.TeamMemberIds = members.Select(x => x.UserId).ToArray();
                return Ok(getTeamResult);

            }

            catch (Exception)
            {
                return StatusCode(500, "A problem happened while handeling your request");
            }

        }

        [HttpPost()]
        public IActionResult CreateTeam([FromBody] TeamCreateDto createTeam)
        {
            string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            var getUser = _transActionRepo.GetUsers().FirstOrDefault(c => c.Guid == userGuid);
            //this should take care of user not being able to create team when already in a team 
            if(getUser.TeamId != null)
            {
                return BadRequest();
            }
            if (createTeam == null)
            {
                return BadRequest();
            }
            if (createTeam.Description == null)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            if (_transActionRepo.TeamExists(createTeam.Name))
            {
                return BadRequest();
            }
            
            var newTeam = _mapper.Map<TraTeam>(createTeam);
            newTeam.UserId = getUser.UserId; // SETS THE USER TO BE THE TEAM LEADER
            _transActionRepo.CreateTeam(newTeam);

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }         

            var createdTeamToReturn = _mapper.Map<TeamDto>(newTeam);
            
            var user = _transActionRepo.GetUser(newTeam.UserId);
            user.TeamId = createdTeamToReturn.TeamId;

            var role = _transActionRepo.GetRoles();
            var roleId = role.Where(x => x.Name == "Team_Lead").Select(c => c.RoleId).FirstOrDefault();
            
            var usersCurrentRole = role.Where(x => x.RoleId == user.RoleId).Select(c => c.Name).FirstOrDefault();
                      
            if (!usersCurrentRole.Equals("Admin"))
            {
                user.RoleId = roleId;
            }
            user.IsFreeAgent = false;

            var userUpdate = _mapper.Map<UserUpdateDto>(user);
            _mapper.Map<TraUser>(userUpdate);

            createdTeamToReturn.NumMembers = 1; // intially team will have only one member when created

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }
            
            return CreatedAtRoute("GetThatUser", new { id = createdTeamToReturn.UserId }, createdTeamToReturn);
        }


        [ClaimRequirement(AuthorizationTypes.EDIT_TEAM_CLAIM)]          
        [HttpPut("{id}")]
        public IActionResult TeamUpdate(int id, [FromBody] TeamUpdateDto teamUpdate)
        {
            string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            var getUser = _transActionRepo.GetUsers().FirstOrDefault(c => c.Guid == userGuid);

            var user = _transActionRepo.GetCurrentUser(getUser.Guid);
            if(user.UserId == teamUpdate.UserId || user.Role.Name.ToLower() == "admin")
            {
                var teamEntity = _transActionRepo.GetTeam(id);
                if (teamEntity == null) return NotFound();
                if (teamUpdate == null) return NotFound();

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                _mapper.Map(teamUpdate, teamEntity);
                if (!_transActionRepo.Save())
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return GetTeam(id);
            }
            else
            {
                return BadRequest();
            }
                        
        }
        [HttpPost("join")]
        public IActionResult AddUserToTeam([FromBody] AddUserToTeamDto addUserToTeam)
        {
            var getUser = _transActionRepo.GetUser(addUserToTeam.UserId);            
            if (getUser.TeamId != null)
            {
                return BadRequest();
            }
            //have to update the teamId and then find and update the member request and set then false on active
            getUser.TeamId = addUserToTeam.TeamId;
            getUser.IsFreeAgent = false;
            var requests = _transActionRepo.GetRequests();
            requests = requests.Where(x => x.UserId == addUserToTeam.UserId && x.IsActive == true);
            foreach(var request in requests)
            {
                request.IsActive = false;
            }
            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }
            return GetTeam(addUserToTeam.TeamId);
        }

        [HttpPost("remove")]
        public IActionResult RemoveUserFromTeam([FromBody] AddUserToTeamDto removeUser)
        {
            var user = _transActionRepo.GetUser(removeUser.UserId);
            var users = _transActionRepo.GetUsers();
            var members = users.Where(x => x.TeamId == removeUser.TeamId);
            var team = _transActionRepo.GetTeam(removeUser.TeamId);
            Random rand = new Random();
            int toSkip = rand.Next(0, members.Count()-1);
            var randomMember = members.Skip(toSkip).Where(x => x.UserId != removeUser.UserId).Take(1).First();

            if (user.TeamId == null)
            {
                return BadRequest();
            }          
            
            if (members.Count() == 1)
            {
                return BadRequest(400);
            }
            var roleId = _transActionRepo.GetRoles().Where(x => x.Name.ToLower() == "team_lead").Select(x => x.RoleId).FirstOrDefault();
            if (user.RoleId == roleId)
            {
                team.UserId = randomMember.UserId;
                randomMember.RoleId = roleId;
                user.TeamId = null;
                roleId = _transActionRepo.GetRoles().Where(x => x.Name.ToLower() == "user").Select(x => x.RoleId).FirstOrDefault();
                user.RoleId = roleId;
            }

            roleId = _transActionRepo.GetRoles().Where(x => x.Name.ToLower() == "user").Select(x => x.RoleId).FirstOrDefault();
            if(user.RoleId == roleId)
            {
                user.TeamId = null;
                user.RoleId = roleId;
            }

            roleId = _transActionRepo.GetRoles().Where(x => x.Name.ToLower() == "admin").Select(x => x.RoleId).FirstOrDefault();
            if(user.RoleId == roleId)
            {
                if(team.UserId == removeUser.UserId)
                {
                    roleId = _transActionRepo.GetRoles().Where(x => x.Name.ToLower() == "team_lead").Select(x => x.RoleId).FirstOrDefault();
                    randomMember.RoleId = roleId;
                    team.UserId = randomMember.UserId;
                }
                user.TeamId = null;
            }
            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            return GetTeam(removeUser.TeamId);
        }

    }
}
