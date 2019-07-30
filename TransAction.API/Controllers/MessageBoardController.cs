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
    [Route("api/messageboard")]
    public class MessageBoardController : BaseController
    {

        public MessageBoardController(IHttpContextAccessor httpContextAccessor, ILogger<ActivityController> logger, IUnitOfWork unitOfWork, IMapper mapper) :
            base(httpContextAccessor, logger, unitOfWork, mapper)
        { }

        [HttpGet()]
        public IActionResult GetTopics(int page = 1, int pageSize = 25)
        {
            var topics = _unitOfWork.Topic.GetAllTopics(page, pageSize);
            var getTopics = _mapper.Map<IEnumerable<TopicDto>>(topics);
            var count = _unitOfWork.Topic.Count();
            return StatusCode(200, new TransActionPagedResponse(getTopics, page, pageSize, count));
        }

        [HttpGet("{id}", Name = "GetTopic")]
        public IActionResult GetTopicById(int id)
        {

            try
            {
                var getTopic = _unitOfWork.Topic.GetTopicById(id);
                if (getTopic == null)
                {
                    return StatusCode(404, new TransActionResponse("Topic not found"));
                }
                var getTopicResult = _mapper.Map<TopicDto>(getTopic);
                return StatusCode(200, new TransActionResponse(getTopicResult));

            }

            catch (Exception)
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request."));
            }
        }

        [HttpPost()]
        public IActionResult CreateTopic([FromBody] TopicCreateDto createTopic)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new TransActionResponse(ModelState));
            }

            var newTopic = _mapper.Map<TraTopic>(createTopic);

            string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            var getUser = _unitOfWork.User.GetByGuid(userGuid);
            newTopic.UserId = getUser.UserId;

            _unitOfWork.Topic.Create(newTopic);
            if (!_unitOfWork.Save())
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request."));
            }

            var message = new TraTopicMessage();
            message.UserId = newTopic.UserId;
            message.TopicId = newTopic.TopicId;
            message.Body = createTopic.Body;

            _unitOfWork.Message.Create(message);

            if (!_unitOfWork.Save())
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request."));
            }

            var createTopicResult = _mapper.Map<TopicDto>(newTopic);
            return CreatedAtRoute("GetTopic", new { id = createTopicResult.TopicId }, new TransActionResponse(createTopicResult));

        }

        [HttpPut("{id}")]
        public IActionResult UpdateTopic(int id, [FromBody] TopicUpdateDto updateTopic, int page = 1, int pageSize = 25)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new TransActionResponse(ModelState));
            }
            var topicEntity = _unitOfWork.Topic.GetTopicById(id);
            if (topicEntity == null) return StatusCode(404, new TransActionResponse("Topic Not Found"));

            string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            var user = _unitOfWork.User.GetCurrentUser(userGuid);

            if (user.Role.Name.ToLower() == "admin" || user.UserId == topicEntity.UserId)
            {

                _mapper.Map(updateTopic, topicEntity);

                _unitOfWork.Topic.Update(topicEntity);

                var mess = topicEntity.TraTopicMessage.FirstOrDefault();
                mess.Body = updateTopic.Body;

                if (!_unitOfWork.Save())
                {
                    return StatusCode(500, new TransActionResponse("A problem happened while handling your request."));
                }

                return GetTopicById(id);
            }
            else
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new TransActionResponse());
            }
        }

        [HttpGet("{topicId}/message")]
        public IActionResult GetMessages(int topicId, int page = 1, int pageSize = 25)
        {
            try
            {
                var getMessage = _unitOfWork.Message.GetAllTopicMessages(page, pageSize, topicId);
                if (getMessage == null)
                {
                    return StatusCode(404, new TransActionResponse("Message Not found"));
                }
                var getMessages = _mapper.Map<IEnumerable<MessageDto>>(getMessage);
                return Ok(getMessages);
            }

            catch (Exception)
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request"));
            }
        }

        [HttpGet("message/{id}", Name = "GetMessage")]
        public IActionResult GetMessageById(int id, int page = 1, int pageSize = 25)
        {

            try
            {
                var getMessage = _unitOfWork.Message.GetMessageById(id);
                if (getMessage == null)
                {
                    return StatusCode(404, new TransActionResponse("Message Not found"));
                }
                var getMessageResult = _mapper.Map<MessageDto>(getMessage);
                int count = _unitOfWork.Message.Count();
                return StatusCode(200, new TransActionPagedResponse(getMessageResult, page, pageSize, count));

            }

            catch (Exception)
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request"));
            }
        }



        [HttpPost("message")]
        public IActionResult CreateMessage([FromBody] MessageCreateDto createMessage)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new TransActionResponse(ModelState.ToString()));
            }

            var newMessage = _mapper.Map<TraTopicMessage>(createMessage);

            string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            var getUser = _unitOfWork.User.GetByGuid(userGuid);
            newMessage.UserId = getUser.UserId;

            _unitOfWork.Message.Create(newMessage);

            if (!_unitOfWork.Save())
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request"));
            }

            var topic = _unitOfWork.Topic.GetTopicById(newMessage.TopicId);
            topic.DbLastUpdateTimestamp = DateTime.Now;

            if (!_unitOfWork.Save())
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request"));
            }

            var createMessageResult = _mapper.Map<MessageDto>(newMessage);
            return CreatedAtRoute("GetMessage", new { id = createMessageResult.TopicMessageId }, new TransActionResponse(createMessageResult));

        }

        [HttpPut("message/{id}")]
        public IActionResult UpdateMessage(int id, [FromBody] MessageUpdateDto updateMessage)
        {
            string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            var getUser = _unitOfWork.User.GetByGuid(userGuid);

            var message = _unitOfWork.Message.GetMessageById(id);

            var user = _unitOfWork.User.GetCurrentUser(getUser.Guid);

            if (user.Role.Name.ToLower() == "admin" || user.UserId == message.UserId)
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new TransActionResponse(ModelState.ToString()));
                }
                var messageEntity = _unitOfWork.Message.GetMessageById(id);
                var topic = _unitOfWork.Topic.GetTopicById(messageEntity.TopicId);
                topic.DbLastUpdateTimestamp = DateTime.Now;
                if (messageEntity == null) return StatusCode(404, new TransActionResponse("Message Not Found"));

                _mapper.Map(updateMessage, messageEntity);

                _unitOfWork.Message.Update(messageEntity);
                if (!_unitOfWork.Save())
                {
                    return StatusCode(500, new TransActionResponse("A problem happened while handling your request"));
                }

                var getMessage = _unitOfWork.Message.GetMessageById(id);
                var getTopicResult = _mapper.Map<MessageDto>(getMessage);
                return StatusCode(200, new TransActionResponse(getTopicResult));

            }
            else
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new TransActionResponse());
            }

        }
        //Fix it later
        [HttpDelete("topic/{topicId}")]
        public IActionResult DeleteTopic(int topicId, int page = 1, int pageSize = 25)
        {
            var topic = _unitOfWork.Topic.GetTopicById(topicId);

            //var checkTopic = _unitOfWork.Topic.GetTopicByTitle(topic.Title);
            if (topic == null)
            {
                return StatusCode(404, new TransActionResponse("Topic Not Found"));
            }
            var messages = _unitOfWork.Message.GetAllTopicMessages(page, pageSize, topicId);
            foreach (var message in messages)
            {
                _unitOfWork.Message.Delete(message);
            }
            _unitOfWork.Topic.Delete(topic);

            if (!_unitOfWork.Save())
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request"));
            }
            return StatusCode(StatusCodes.Status204NoContent, new TransActionResponse());
        }

        [HttpDelete("message/{messageId}")]
        public IActionResult DeleteMessage(int messageId)
        {
            var message = _unitOfWork.Message.GetMessageById(messageId);
            if (message == null)
            {
                return StatusCode(404, new TransActionResponse("Message Does not exist"));
            }
            var deleteMessage = _unitOfWork.Message.GetMessageById(messageId);
            _unitOfWork.Message.Delete(deleteMessage);
            if (!_unitOfWork.Save())
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request"));
            }
            return StatusCode(StatusCodes.Status204NoContent, new TransActionResponse());

        }
    }
}
