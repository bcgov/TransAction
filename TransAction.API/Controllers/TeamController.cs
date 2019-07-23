using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using TransAction.API.Helpers;
using TransAction.Data.Models;
using TransAction.Data.Repositories.Interfaces;
using AutoMapper;
using TransAction.API.Responses;

namespace TransAction.API.Controllers
{
    [Route("api/teams")]
    public class TeamController : BaseController
    {

        public TeamController(IHttpContextAccessor httpContextAccessor, ILogger<ActivityController> logger, IUnitOfWork unitOfWork, IMapper mapper) :
            base(httpContextAccessor, logger, unitOfWork, mapper)
        { }


        [HttpGet()]
        public IActionResult GetTeams(string Name, int page = 1, int pageSize = 25)
        {
            var teams = _unitOfWork.Team.GetAll(Name, page, pageSize);
            var getTeams = _mapper.Map<IEnumerable<TeamDto>>(teams);
            foreach (var team in getTeams)
            {
                var members = _unitOfWork.User.GetByTeamId(team.TeamId);
                team.NumMembers = members.Count();
                team.TeamMemberIds = members.Select(x => x.UserId).ToArray();

            }
            var resultTeams = getTeams.Where(x => x.NumMembers > 0);
            return StatusCode(200, new TransActionPagedResponse(resultTeams, page, pageSize, _unitOfWork.Team.Count(Name)));
        }

        [HttpGet("{id}")]
        public IActionResult GetTeamById(int id)
        {
            try
            {
                var getTeam = _unitOfWork.Team.GetById(id);

                if (getTeam == null)
                {
                    return StatusCode(404, new TransActionResponse("Team Not found"));
                }
                var members = _unitOfWork.User.GetByTeamId(id);
                var getTeamResult = _mapper.Map<TeamDto>(getTeam);
                getTeamResult.NumMembers = members.Count();
                getTeamResult.TeamMemberIds = members.Select(x => x.UserId).ToArray();
                return StatusCode(200, new TransActionResponse(getTeamResult));

            }

            catch (Exception)
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request"));
            }

        }

        [HttpPost()]
        public IActionResult CreateTeam([FromBody] TeamCreateDto createTeam)
        {
            string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            var getUser = _unitOfWork.User.GetByGuid(userGuid);

            if (getUser.TeamId != null) //User not being able to create team when already in a team
            {
                return BadRequest(new TransActionResponse("User is already in the team"));
            }
            if (createTeam == null)
            {
                return BadRequest(new TransActionResponse("No Team Entered"));
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(new TransActionResponse(ModelState));
            }

            if (_unitOfWork.Team.GetTeamByName(createTeam.Name))
            {
                return BadRequest(new TransActionResponse("Team Already Exists"));
            }

            var newTeam = _mapper.Map<TraTeam>(createTeam);

            newTeam.UserId = getUser.UserId;// Sets the user to be the team leader
            _unitOfWork.Team.Create(newTeam);

            if (!_unitOfWork.Save())
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request."));
            }

            var createdTeamToReturn = _mapper.Map<TeamDto>(newTeam);

            var user = _unitOfWork.User.GetById(newTeam.UserId);
            user.TeamId = createdTeamToReturn.TeamId;

            user.IsFreeAgent = false;

            var userUpdate = _mapper.Map<UserUpdateDto>(user);
            _unitOfWork.User.Update(user);

            createdTeamToReturn.NumMembers = 1; // intially team will have only one member when created

            if (!_unitOfWork.Save())
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request."));
            }

            return CreatedAtRoute("GetUser", new { id = createdTeamToReturn.UserId }, new TransActionResponse(createdTeamToReturn));
        }

        [HttpPut("{id}")]
        public IActionResult UpdateTeam(int id, [FromBody] TeamUpdateDto teamUpdate)
        {
            string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            var getUser = _unitOfWork.User.GetByGuid(userGuid);

            var user = _unitOfWork.User.GetCurrentUser(getUser.Guid);
            if (user.UserId == teamUpdate.UserId || user.Role.Name.ToLower() == "admin") // checking if the user is the team Leader or an admin.
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new TransActionResponse(ModelState));
                }
                var teamEntity = _unitOfWork.Team.GetById(id);
                if (teamEntity == null) return StatusCode(StatusCodes.Status404NotFound, new TransActionResponse("Team Not Found"));

                _mapper.Map(teamUpdate, teamEntity);
                _unitOfWork.Team.Update(teamEntity);
                if (!_unitOfWork.Save())
                {
                    return StatusCode(500, new TransActionResponse("A problem happened while handling your request."));
                }

                return GetTeamById(id);
            }
            else
            {
                return StatusCode(401, new TransActionResponse("Unauthorized Access"));
            }

        }
        [HttpPost("join")]
        public IActionResult AddUserToTeam([FromBody] AddUserToTeamDto addUserToTeam, int page = 1, int pageSize = 25)
        {
            var getUser = _unitOfWork.User.GetById(addUserToTeam.UserId);
            if (getUser.TeamId != null)
            {
                return BadRequest(new TransActionResponse("The user is already in a team"));
            }
            var numMembers = _unitOfWork.User.GetByTeamId(addUserToTeam.TeamId).Count();
            if (numMembers >= 5)
            {
                return BadRequest(new TransActionResponse("The team is full"));
            }
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
                    return StatusCode(500, new TransActionResponse("A problem happened while handling your request."));
                }
                return GetTeamById(addUserToTeam.TeamId);
            }
            else
            {
                return StatusCode(401, new TransActionResponse("Unauthorized Access"));
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
                return BadRequest(new TransActionResponse("The user in not in a team"));
            }

            if (members.Count() == 1)
            {
                return StatusCode(400, new TransActionResponse("User can not leave the team"));
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
                    return StatusCode(500, new TransActionResponse("A problem happened while handling your request."));
                }

                return GetTeamById(removeUser.TeamId);
            }
            else
            {
                return StatusCode(401, new TransActionResponse("Unauthorized Access"));
            }

        }

    }
}
