using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using TransAction.API.Helpers;
using TransAction.Data.Models;
using TransAction.Data.Repositories.Interfaces;
using AutoMapper;
using TransAction.API.Responses;

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
            return StatusCode(200, new TransActionPagedResponse(getUsers, page, pageSize, _unitOfWork.User.Count()));
        }

        [HttpGet("{id}", Name = "GetUser")]
        public IActionResult GetUserById(int id)
        {
            var getUser = _unitOfWork.User.GetById(id);

            if (getUser == null)
            {
                return StatusCode(404, new TransActionResponse("User does not exist"));
            }

            var getUserResult = _mapper.Map<UserDto>(getUser);
            return StatusCode(200, new TransActionResponse(getUserResult));
        }

        [HttpPost()]
        public IActionResult CreateUser([FromBody] UserCreateDto createUser)
        {
            if (createUser == null)
            {
                return BadRequest(new TransActionResponse("User not entered"));
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new TransActionResponse(ModelState.ToString()));
            }

            var user = _unitOfWork.User.GetByGuid(createUser.Guid);

            if (user != null)
            {
                return BadRequest(); // check for the message for response class;
            }

            var newUser = _mapper.Map<TraUser>(createUser);

            _unitOfWork.User.Create(newUser);

            if (!_unitOfWork.Save())
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request."));
            }

            var createdUserToReturn = _mapper.Map<UserDto>(newUser);
            return CreatedAtRoute("GetUser", new { id = createdUserToReturn.UserId }, new TransActionResponse(createdUserToReturn));
        }

        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, [FromBody] UserUpdateDto updateUser)
        {
            string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            var getUser = _unitOfWork.User.GetByGuid(userGuid);
            if (getUser.Role.Name.ToLower() != "admin" || getUser.UserId != id)
            {
                return BadRequest(new TransActionResponse("Unauthorized user"));
            }
            var userEntity = _unitOfWork.User.GetById(id);
            if (userEntity == null) return NotFound();
            if (updateUser == null) return NotFound();

            if (!ModelState.IsValid)
            {
                return BadRequest(new TransActionResponse(ModelState.ToString()));
            }

            _mapper.Map(updateUser, userEntity);

            _unitOfWork.User.Update(userEntity);

            if (!_unitOfWork.Save())
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request."));
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
                return StatusCode(200, new TransActionResponse(getUserResult));

            }

            catch (Exception)
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handeling your request"));
            }
        }

    }
}
