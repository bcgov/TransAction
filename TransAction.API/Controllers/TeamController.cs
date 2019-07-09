using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using TransAction.API.Helpers;
using TransAction.Data.Models;

namespace TransAction.API.Controllers
{
    [Route("api/teams")]
    public class TeamController : BaseController
    {

        public TeamController(IHttpContextAccessor httpContextAccessor, ILogger<TeamController> logger) :
            base(httpContextAccessor, logger)
        { }


        [HttpGet()]
        public IActionResult GetTeams(int page = 1, int pageSize = 25)
        {
            var teams = _unitOfWork.Team.GetAll(page, pageSize);
            var getTeams = _mapper.Map<IEnumerable<TeamDto>>(teams);
            foreach (var team in getTeams)
            {
                var members = _unitOfWork.User.GetByTeamId(team.TeamId);
                team.NumMembers = members.Count();
                team.TeamMemberIds = members.Select(x => x.UserId).ToArray();

            }
            var resultTeams = getTeams.Where(x => x.NumMembers > 0);
            return Ok(resultTeams);
        }

        [HttpGet("{id}")]
        public IActionResult GetTeamById(int id)
        {
            try
            {
                var getTeams = _unitOfWork.Team.GetById(id);

                if (getTeams == null)
                {
                    return NotFound();
                }
                var getTeam = _unitOfWork.Team.GetById(id);
                // var users = _transActionRepo.GetUsers();
                var members = _unitOfWork.User.GetByTeamId(id);
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
            var getUser = _unitOfWork.User.GetByGuid(userGuid);
            //this should take care of user not being able to create team when already in a team
            if (getUser.TeamId != null)
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

            if (_unitOfWork.Team.GetTeamByName(createTeam.Name))
            {
                return BadRequest();
            }

            var newTeam = _mapper.Map<TraTeam>(createTeam);
            newTeam.UserId = getUser.UserId; // SETS THE USER TO BE THE TEAM LEADER
            _unitOfWork.Team.Create(newTeam);

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var createdTeamToReturn = _mapper.Map<TeamDto>(newTeam);

            var user = _unitOfWork.User.GetById(newTeam.UserId);
            user.TeamId = createdTeamToReturn.TeamId;

            //var role = _transActionRepo.GetRoles();
            //var roleId = role.Where(x => x.Name == "Team_Lead").Select(c => c.RoleId).FirstOrDefault();

            //var usersCurrentRole = role.Where(x => x.RoleId == user.RoleId).Select(c => c.Name).FirstOrDefault();

            //if (!usersCurrentRole.Equals("Admin"))
            //{
            //    user.RoleId = roleId;
            //}
            user.IsFreeAgent = false;

            var userUpdate = _mapper.Map<UserUpdateDto>(user);
            _unitOfWork.User.Update(user);

            createdTeamToReturn.NumMembers = 1; // intially team will have only one member when created

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            return CreatedAtRoute("GetUser", new { id = createdTeamToReturn.UserId }, createdTeamToReturn);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateTeam(int id, [FromBody] TeamUpdateDto teamUpdate)
        {
            string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            var getUser = _unitOfWork.User.GetByGuid(userGuid);

            var user = _unitOfWork.User.GetCurrentUser(getUser.Guid);
            if (user.UserId == teamUpdate.UserId || user.Role.Name.ToLower() == "admin")
            {
                var teamEntity = _unitOfWork.Team.GetById(id);
                if (teamEntity == null) return NotFound();
                if (teamUpdate == null) return NotFound();

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                _mapper.Map(teamUpdate, teamEntity);
                _unitOfWork.Team.Update(teamEntity);
                if (!_transActionRepo.Save())
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return GetTeamById(id);
            }
            else
            {
                return BadRequest();
            }

        }
        [HttpPost("join")]
        public IActionResult AddUserToTeam([FromBody] AddUserToTeamDto addUserToTeam, int page = 1, int pageSize = 25)
        {
            var getUser = _unitOfWork.User.GetById(addUserToTeam.UserId);
            if (getUser.TeamId != null)
            {
                return BadRequest();
            }
            var user = _unitOfWork.User.GetByTeamId(addUserToTeam.TeamId).Count();
            if (user >= 5)
            {
                return BadRequest();
            }
            //var users = _transActionRepo.GetUsers();
            //var numMembers = users.Where(y => y.TeamId == getUser.TeamId).Count();
            //if(numMembers >= 5)
            //{
            //    return BadRequest();
            //}
            //have to update the teamId and then find and update the member request and set then false on active


            string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            var getCurrentUser = _unitOfWork.User.GetByGuid(userGuid);
            var getTeam = _unitOfWork.Team.GetById(addUserToTeam.TeamId);
            if (getCurrentUser.Role.Name.ToLower() == "admin" || getCurrentUser.UserId == getTeam.UserId)
            {
                getUser.TeamId = addUserToTeam.TeamId;
                getUser.IsFreeAgent = false;
                var requests = _unitOfWork.Request.GetAllReq(page, pageSize);
                requests = requests.Where(x => x.UserId == addUserToTeam.UserId && x.IsActive == true);
                foreach (var request in requests)
                {
                    request.IsActive = false;
                }

                _unitOfWork.User.Update(getUser);

                if (!_unitOfWork.Save())
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }
                return GetTeamById(addUserToTeam.TeamId);
            }
            else
            {
                return BadRequest();
            }


        }

        [HttpPost("remove")]
        public IActionResult RemoveUserFromTeam([FromBody] AddUserToTeamDto removeUser)
        {
            var user = _unitOfWork.User.GetById(removeUser.UserId);
            var members = _unitOfWork.User.GetByTeamId(removeUser.TeamId);
            var team = _unitOfWork.Team.GetById(removeUser.TeamId);


            if (user.TeamId == null)
            {
                return BadRequest();
            }

            if (members.Count() == 1)
            {
                return BadRequest(400);
            }
            string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            var getCurrentUser = _unitOfWork.User.GetByGuid(userGuid);
            var getTeam = _unitOfWork.Team.GetById(removeUser.TeamId);
            if (getCurrentUser.Role.Name.ToLower() == "admin" || getCurrentUser.UserId == getTeam.UserId || getCurrentUser.UserId == removeUser.UserId)
            {
                if (team.UserId == removeUser.UserId)
                {
                    Random rand = new Random();
                    int toSkip = rand.Next(0, members.Count() - 1);
                    var randomMember = members.Skip(toSkip).Where(x => x.UserId != removeUser.UserId).Take(1).First();

                    team.UserId = randomMember.UserId;
                }

                user.TeamId = null;

                _unitOfWork.User.Update(user);

                if (!_unitOfWork.Save())
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return GetTeamById(removeUser.TeamId);
            }
            else
            {
                return BadRequest();
            }

        }

    }
}
