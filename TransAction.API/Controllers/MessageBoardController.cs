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
    [Route("api/messageboard")]
    public class MessageBoardController : BaseController
    {

        public MessageBoardController(IHttpContextAccessor httpContextAccessor, ILogger<MessageBoardController> logger) :
            base(httpContextAccessor, logger)
        { }

        [HttpGet()]
        public IActionResult GetTopics(/*int page = 1, int pageSize = 25*/)
        {
            // var topics = _unitOfWork.Topic.GetAllTopics(page, pageSize);
            var topics = _transActionRepo.GetTopics();
            var getTopics = _mapper.Map<IEnumerable<TopicDto>>(topics);
            return Ok(getTopics);
        }

        [HttpGet("{id}", Name = "GetTopic")]
        public IActionResult GetTopicById(int id)
        {

            try
            {
                // var getTopic = _unitOfWork.Topic.GetTopicById(id);
                var getTopics = _transActionRepo.GetTopics().FirstOrDefault(c => c.TopicId == id);
                if (getTopics == null)
                {
                    return NotFound();
                }
                var getTopic = _transActionRepo.GetTopic(id);
                var getTopicResult = _mapper.Map<TopicDto>(getTopic);
                return Ok(getTopicResult);

            }

            catch (Exception)
            {
                return StatusCode(500, "A problem happened while handeling your request");
            }
        }

        [HttpPost()]
        public IActionResult CreateTopic([FromBody] TopicCreateDto createTopic)
        {
            if (createTopic == null)
            {
                return BadRequest();
            }
            if (createTopic.Title == null)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var newTopic = _mapper.Map<TraTopic>(createTopic);

            string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            var getUser = _unitOfWork.User.GetByGuid(userGuid);
            newTopic.UserId = getUser.UserId;

            //_unitOfWork.Topic.Create(newTopic); // have not changed it yet
            _transActionRepo.CreateTopic(newTopic);
            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var message = new TraTopicMessage();
            message.UserId = newTopic.UserId;
            message.TopicId = newTopic.TopicId;
            message.Body = createTopic.Body;

            _transActionRepo.CreateTopicMessage(message);
            //_unitOfWork.Message.Create(message);

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var createTopicResult = _mapper.Map<TopicDto>(newTopic);
            return CreatedAtRoute("GetTopic", new { id = createTopicResult.TopicId }, createTopicResult);

        }

        [HttpPut("{id}")]
        public IActionResult UpdateTopic(int id, [FromBody] TopicUpdateDto updateTopic)
        {
            var topicEntity = _unitOfWork.Topic.GetTopicById(id);
            if (topicEntity == null) return NotFound();
            if (updateTopic == null) return NotFound();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            var getUser = _unitOfWork.User.GetByGuid(userGuid);
            topicEntity.UserId = getUser.UserId;
            _mapper.Map(updateTopic, topicEntity);


            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            return GetTopicById(id);
        }

        [HttpGet("{topicId}/message")]
        public IActionResult GetMessages(int topicId, int page = 1, int pageSize = 25)
        {
            try
            {
                // var getMessage = _unitOfWork.Message.GetAllMessages(page, pageSize, topicId);
                var getMessage = _transActionRepo.GetTopicMessages(topicId);
                if (getMessage == null)
                {
                    return NotFound();
                }
                var getMessages = _mapper.Map<IEnumerable<MessageDto>>(getMessage);
                return Ok(getMessages);
            }

            catch (Exception)
            {
                return StatusCode(500, "A problem happened while handeling your request");
            }
        }

        [HttpGet("message/{id}", Name = "GetMessage")]
        public IActionResult GetMessageById(int id, int page = 1, int pageSize = 25)
        {

            try
            {
                // var getMessages = _unitOfWork.Message.GetAllMessages(page, pageSize, id);
                var getMessages = _transActionRepo.GetMessages();
                if (getMessages == null)
                {
                    return NotFound();
                }
                var getMessage = _unitOfWork.Message.GetMessageById(id);
                var getMessageResult = _mapper.Map<MessageDto>(getMessage);
                return Ok(getMessageResult);

            }

            catch (Exception)
            {
                return StatusCode(500, "A problem happened while handeling your request");
            }
        }



        [HttpPost("message")]
        public IActionResult CreateMessage([FromBody] MessageCreateDto createMessage)
        {
            if (createMessage == null)
            {
                return BadRequest();
            }
            if (createMessage.Body == null)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newMessage = _mapper.Map<TraTopicMessage>(createMessage);

            string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            var getUser = _unitOfWork.User.GetByGuid(userGuid);
            newMessage.UserId = getUser.UserId;



            //_unitOfWork.Message.Create(newMessage);
            _transActionRepo.CreateTopicMessage(newMessage);

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var topic = _unitOfWork.Topic.GetTopicById(newMessage.TopicId);
            topic.DbLastUpdateTimestamp = DateTime.Now;

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var createMessageResult = _mapper.Map<MessageDto>(newMessage);
            return CreatedAtRoute("GetMessage", new { id = createMessageResult.TopicMessageId }, createMessageResult);

        }

        [HttpPut("message/{id}")]
        public IActionResult UpdateMessage(int id, [FromBody] MessageUpdateDto updateMessage)
        {
            string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            var getUser = _unitOfWork.User.GetByGuid(userGuid);

            var message = _transActionRepo.GetTopicMessage(id);

            var user = _transActionRepo.GetCurrentUser(getUser.Guid);
            if (user.Role.Name.ToLower() == "admin" || user.UserId == message.UserId)
            {
                var messageEntity = _transActionRepo.GetTopicMessage(id);
                var topic = _unitOfWork.Topic.GetTopicById(messageEntity.TopicId);
                topic.DbLastUpdateTimestamp = DateTime.Now;
                if (messageEntity == null) return NotFound();
                if (updateMessage == null) return NotFound();

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                _mapper.Map(updateMessage, messageEntity);


                if (!_transActionRepo.Save())
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var getMessage = _transActionRepo.GetTopicMessage(id);
                var getTopicResult = _mapper.Map<MessageDto>(getMessage);
                return Ok(getTopicResult);

            }
            else
            {
                return BadRequest();
            }

        }

        [HttpDelete("topic/{topicId}")]
        public IActionResult DeleteTopic(int topicId)
        {
            var topic = _unitOfWork.Topic.GetTopicById(topicId);
            if (!_transActionRepo.TopicExists(topic.Title))
            {
                return NotFound();
            }
            var messages = _transActionRepo.GetTopicMessages(topicId);
            foreach (var message in messages)
            {
                _transActionRepo.DeleteTopicMessage(message);
            }
            _transActionRepo.DeleteTopic(topic);

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }
            return NoContent();
        }

        [HttpDelete("message/{messageId}")]
        public IActionResult DeleteMessage(int messageId)
        {
            var message = _transActionRepo.GetTopicMessage(messageId);
            if (message == null)
            {
                return NotFound();
            }
            var deleteMessage = _transActionRepo.GetTopicMessage(messageId);
            _transActionRepo.DeleteTopicMessage(deleteMessage);
            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }
            return NoContent();

        }
    }
}
