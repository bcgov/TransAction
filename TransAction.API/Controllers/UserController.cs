using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using TransAction.API.Helpers;
using TransAction.Data.Models;
using TransAction.Data.Repositories.Interfaces;
using AutoMapper;

namespace TransAction.API.Controllers
{
    [Route("api/users")]
    public class UserController : BaseController
    {

        public UserController(IHttpContextAccessor httpContextAccessor, ILogger<ActivityController> logger, IUnitOfWork unitOfWork, IMapper mapper) :
            base(httpContextAccessor, logger, unitOfWork, mapper)
        { }


        [HttpGet()]
        public IActionResult GetUsers(int page = 1, int pageSize = 25)
        {
            var user = _unitOfWork.User.GetAll(page, pageSize);
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
            string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            var getUser = _unitOfWork.User.GetByGuid(userGuid);
            if (getUser.Role.Name.ToLower() != "admin" || getUser.UserId != id)
            {
                return BadRequest();
            }
            var userEntity = _unitOfWork.User.GetById(id);
            if (userEntity == null) return NotFound();
            if (updateUser == null) return NotFound();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

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
