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
    [Route("api/user")]
    public class UserController : Controller
    {
        private ITransActionRepo _transActionRepo;
        public UserController(ITransActionRepo transActionRepo, IHttpContextAccessor httpContextAccessor)
        {
            _transActionRepo = transActionRepo;
        }

        
        [HttpGet()]
        public IActionResult GetUsers()
        {
            var user = _transActionRepo.GetUsers();
            var getEvents = Mapper.Map<IEnumerable<UserDto>>(user);
            return Ok(getEvents);

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
            if (createUser.Guid == null || createUser.Username == null || createUser.Directory == null || createUser.Region == null)
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

          //  newUser.DbCreateTimestamp = DateTime.Now;
          //  newUser.DbLastUpdateTimestamp = newUser.DbCreateTimestamp;

            newUser.DbCreateUserid = "Test User";
            newUser.DbLastUpdateUserid = "Test User";
                       
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
            var userEntity = _transActionRepo.GetUser(id);
            if (userEntity == null) return NotFound();
            if (updateUser == null) return NotFound();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

          //  userEntity.DbLastUpdateTimestamp = DateTime.Now;
            userEntity.DbLastUpdateUserid = "Test User";

            Mapper.Map(updateUser, userEntity);

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            return NoContent();
        }
        
    }
}
