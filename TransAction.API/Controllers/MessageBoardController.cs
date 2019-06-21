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
        public IActionResult GetTopics()
        {
            var topics = _transActionRepo.GetTopics();
            var getTopics = _mapper.Map<IEnumerable<TopicDto>>(topics);
            return Ok(getTopics);
        }

        [HttpGet("{id}", Name = "GetThatTopic")]
        public IActionResult GetTopic(int id)
        {

            try
            {
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
            var getUser = _transActionRepo.GetUsers().FirstOrDefault(c => c.Guid == userGuid);
            newTopic.UserId = getUser.UserId;

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

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var createdPointOfInterestToReturn = _mapper.Map<TopicDto>(newTopic);
            return CreatedAtRoute("GetThatTopic", new { id = createdPointOfInterestToReturn.TopicId }, createdPointOfInterestToReturn);

        }

        [HttpPut("{id}")]
        public IActionResult TopicUpdate(int id, [FromBody] TopicUpdateDto updateTopic)
        {
            var topicEntity = _transActionRepo.GetTopic(id);
            if (topicEntity == null) return NotFound();
            if (updateTopic == null) return NotFound();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            var getUser = _transActionRepo.GetUsers().FirstOrDefault(c => c.Guid == userGuid);
            topicEntity.UserId = getUser.UserId;
            _mapper.Map(updateTopic, topicEntity);


            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            return GetTopic(id);
        }

        [HttpGet("{topicId}/message", Name = "GetThatMessage")]
        public IActionResult GetMessages(int topicId)
        {
            try
            {
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

       

        [HttpPost("message")]
        public IActionResult CreateMessage([FromBody] MessageUpdateDto createTopic)
        {
            if (createTopic == null)
            {
                return BadRequest();
            }
            if (createTopic.Body == null)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newMessage = _mapper.Map<TraTopicMessage>(createTopic);

            string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            var getUser = _transActionRepo.GetUsers().FirstOrDefault(c => c.Guid == userGuid);
            newMessage.UserId = getUser.UserId;



            _transActionRepo.CreateTopicMessage(newMessage);

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var topic = _transActionRepo.GetTopic(newMessage.TopicId);
            topic.DbLastUpdateTimestamp = DateTime.Now;

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var createdPointOfInterestToReturn = _mapper.Map<MessageDto>(newMessage);
            return CreatedAtRoute("GetThatTopic", new { id = createdPointOfInterestToReturn.TopicId }, createdPointOfInterestToReturn);

        }

        [HttpPut("message/{id}")]
        public IActionResult MessageUpdate(int id, [FromBody] MessageUpdateDto updateMessage)
        {
            string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            var getUser = _transActionRepo.GetUsers().FirstOrDefault(c => c.Guid == userGuid);

            var message = _transActionRepo.GetTopicMessage(id);

            var user = _transActionRepo.GetCurrentUser(getUser.Guid);
            if( user.Role.Name.ToLower() == "admin" ||user.UserId == message.UserId )
            {
                var messageEntity = _transActionRepo.GetTopicMessage(id);
                var topic = _transActionRepo.GetTopic(messageEntity.TopicId);
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
            var topic = _transActionRepo.GetTopic(topicId);
            if (!_transActionRepo.TopicExists(topic.Title))
            {
                return NotFound();
            }
            var messages = _transActionRepo.GetTopicMessages(topicId);
            foreach(var message in messages)
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