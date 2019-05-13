using AutoMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TransAction.API.Helpers;
using TransAction.Data.Models;
using TransAction.Data.Services;

namespace TransAction.API.Controllers
{
    [Route("api/users")]
    public class UserController : Controller
    {
        private ITransActionRepo _transActionRepo;
        private IHttpContextAccessor _httpContextAccessor;
        
        public UserController(ITransActionRepo transActionRepo, IHttpContextAccessor httpContextAccessor)
        {
            _transActionRepo = transActionRepo;
            _httpContextAccessor = httpContextAccessor;
             
        }

        
        [HttpGet()]
        public IActionResult GetUsers()
        {
            var user = _transActionRepo.GetUsers();
            var getUsers = Mapper.Map<IEnumerable<UserDto>>(user);
            return Ok(getUsers);

        }
        
        [HttpGet("{id}", Name = "GetThatUser")]
        public IActionResult GetUser(int id)
        {
            try
            {
                var getUsers = _transActionRepo.GetUsers().FirstOrDefault(c => c.UserId == id);

                if (getUsers == null)
                {
                    return NotFound();
                }
                var getUser = _transActionRepo.GetUser(id);
                var getUserResult = Mapper.Map<UserDto>(getUser);
                return Ok(getUserResult);

            }

            catch (Exception)
            {
                return StatusCode(500, "A problem happened while handeling your request");
            }      

        }
        
        [HttpPost()]
        public IActionResult CreateUser([FromBody] UserCreateDto createUser)
        {
            if (createUser == null) 
            {
                return BadRequest();
            }
            if (createUser.Guid == null || createUser.Username == null || createUser.Directory == null)
            {
                return BadRequest();
            }
            if(createUser.Fname == null || createUser.Lname == null || createUser.Description == null || createUser.Email == null)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (_transActionRepo.UserExists(createUser.Username , createUser.Email))
            {
                return BadRequest();
            }

            var newUser = Mapper.Map<TraUser>(createUser);
                       
            _transActionRepo.CreateUser(newUser);

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var createdUserToReturn = Mapper.Map<UserDto>(newUser);
            return CreatedAtRoute("GetThatUser", new { id = createdUserToReturn.UserId }, createdUserToReturn);
        }
        
        [HttpPut("{id}")]
        public IActionResult UserUpdate(int id, [FromBody] UserUpdateDto updateUser)
        {
            //string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            //var getUser = _transActionRepo.GetUsers().FirstOrDefault(c => c.Guid == userGuid);
            //if(getUser.UserId != id)
            //{
            //    return BadRequest();
            //}
            var userEntity = _transActionRepo.GetUser(id);
           if (userEntity == null) return NotFound();
            if (updateUser == null) return NotFound();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (userEntity.TeamId == null && updateUser.TeamId != null)
            {
                updateUser.IsFreeAgent = false;
            }
            var role = _transActionRepo.GetRoles();            
            var roleId = role.Where(x => x.Name == "User").Select(c => c.RoleId).FirstOrDefault(); //gets the role id corresponding to the user
            var usersCurrentRole = role.Where(x => x.RoleId == updateUser.RoleId).Select(c => c.Name).FirstOrDefault();

            if (userEntity.TeamId != null && updateUser.TeamId == null && usersCurrentRole.Equals("Team_Lead"))
            {
                updateUser.RoleId = roleId;               
            }
            if (userEntity.TeamId != null && updateUser.TeamId == null)
            {
                updateUser.IsFreeAgent = true;
            }
            //checking for if team is full 
            //if user wants to join a team, a put request would update the teamId, so use that to find no of members in the team
            
            var users = _transActionRepo.GetUsers();
            if(updateUser.TeamId != null)
            {
                var members = users.Where(x => x.TeamId == updateUser.TeamId).Count();
                if (members >= 5)
                {
                    return BadRequest("Team Full");
                }
            }          


            Mapper.Map(updateUser, userEntity);

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }
            var user = GetUser(id);
            return GetUser(id);

        }
        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {                  

            try
            {
                
                string userGuid = UserHelper.GetUserGuid(_httpContextAccessor); 
                var getUsers = _transActionRepo.GetUsers().FirstOrDefault(c => c.Guid == userGuid);

                if (getUsers == null)
                {
                    return NotFound();
                }
              
                var getUserResult = Mapper.Map<UserDto>(getUsers);
                return Ok(getUserResult);

            }

            catch (Exception)
            {
                return StatusCode(500, "A problem happened while handeling your request");
            }
        }
        
    }
}
