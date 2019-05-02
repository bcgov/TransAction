using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TransAction.Data.Models;
using TransAction.Data.Services;

namespace TransAction.API.Controllers
{
    [Route("api/teams")]
    public class TeamController : Controller
    {
        private ITransActionRepo _transActionRepo;
        public TeamController(ITransActionRepo transActionRepo, IHttpContextAccessor httpContextAccessor)
        {
            _transActionRepo = transActionRepo;
        }


        [HttpGet()]
        public IActionResult GetTeams()
        {
            var teams = _transActionRepo.GetTeams();
            var getTeams = Mapper.Map<IEnumerable<TeamDto>>(teams);
            return Ok(getTeams);

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
                var members = users.Where(x => x.TeamId == id).Count();                
                var getTeamResult = Mapper.Map<TeamDto>(getTeam);
                getTeamResult.NumMembers = members;
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
            
            var newTeam = Mapper.Map<TraTeam>(createTeam);
            _transActionRepo.CreateTeam(newTeam);

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }         

            var createdTeamToReturn = Mapper.Map<TeamDto>(newTeam);
            
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

            var userUpdate = Mapper.Map<UserUpdateDto>(user);
            Mapper.Map<TraUser>(userUpdate);

            createdTeamToReturn.NumMembers = 1; // intially team will have only one member when created

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }
            
            return CreatedAtRoute("GetThatUser", new { id = createdTeamToReturn.UserId }, createdTeamToReturn);
        }

        [HttpPut("{id}")]
        public IActionResult TeamUpdate(int id, [FromBody] TeamUpdateDto teamUpdate)
        {
            var teamEntity = _transActionRepo.GetTeam(id);
            if (teamEntity == null) return NotFound();
            if (teamUpdate == null) return NotFound();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            Mapper.Map(teamUpdate, teamEntity);           
            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }            

            return GetTeam(id);
        }



    }
}
