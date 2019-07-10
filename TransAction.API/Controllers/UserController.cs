using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using TransAction.API.Helpers;
using TransAction.Data.Models;

namespace TransAction.API.Controllers
{
    [Route("api/users")]
    public class UserController : BaseController
    {

        public UserController(IHttpContextAccessor httpContextAccessor, ILogger<UserController> logger) :
            base(httpContextAccessor, logger)
        { }


        [HttpGet()]
        public IActionResult GetUsers()
        {
            var user = _unitOfWork.User.GetAll();
            var getUsers = _mapper.Map<IEnumerable<UserDto>>(user);
            return Ok(getUsers);
        }

        [HttpGet("{id}", Name = "GetUser")]
        public IActionResult GetUserById(int id)
        {
            var getUser = _unitOfWork.User.GetById(id);

            if (getUser == null)
            {
                return NotFound();
            }

            var getUserResult = _mapper.Map<UserDto>(getUser);

            return Ok(getUserResult);
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
            if (createUser.Fname == null || createUser.Lname == null || createUser.Description == null || createUser.Email == null)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = _unitOfWork.User.GetByGuid(createUser.Guid);

            if (user != null)
            {
                return BadRequest();
            }

            var newUser = _mapper.Map<TraUser>(createUser);

            _unitOfWork.User.Create(newUser);

            if (!_unitOfWork.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var createdUserToReturn = _mapper.Map<UserDto>(newUser);
            return CreatedAtRoute("GetUser", new { id = createdUserToReturn.UserId }, createdUserToReturn);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, [FromBody] UserUpdateDto updateUser)
        {
            //string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            //var getUser = _transActionRepo.GetUsers().FirstOrDefault(c => c.Guid == userGuid);
            //if(getUser.UserId != id)
            //{
            //    return BadRequest();
            //}
            var userEntity = _unitOfWork.User.GetById(id);
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
            //var role = _transActionRepo.GetRoles();
            //var roleId = role.Where(x => x.Name == "User").Select(c => c.RoleId).FirstOrDefault(); //gets the role id corresponding to the user
            //var usersCurrentRole = role.Where(x => x.RoleId == updateUser.RoleId).Select(c => c.Name).FirstOrDefault();

            //if (userEntity.TeamId != null && updateUser.TeamId == null && usersCurrentRole.Equals("Team_Lead"))
            //{
            //    updateUser.RoleId = roleId;
            //}

            //checking for if team is full
            //if user wants to join a team, a put request would update the teamId, so use that to find no of members in the team

            //var users = _transActionRepo.GetUsers();
            //if (updateUser.TeamId != null)
            //{
            //    var members = users.Where(x => x.TeamId == updateUser.TeamId).Count();
            //    if (members >= 5)
            //    {
            //        return BadRequest("Team Full");
            //    }
            //}

            _mapper.Map(updateUser, userEntity);

            _unitOfWork.User.Update(userEntity);

            if (!_unitOfWork.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            return Ok(_mapper.Map<UserDto>(userEntity));

        }
        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            try
            {
                string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
                var getUsers = _unitOfWork.User.GetByGuid(userGuid);

                if (getUsers == null)
                {
                    return NotFound();
                }

                var getUserResult = _mapper.Map<UserDto>(getUsers);
                return Ok(getUserResult);

            }

            catch (Exception)
            {
                return StatusCode(500, "A problem happened while handeling your request");
            }
        }

    }
}
