﻿using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TransAction.API.Authorization;
using TransAction.API.Helpers;
using TransAction.Data.Models;
using TransAction.Data.Services;

namespace TransAction.API.Controllers
{
    [Route("api/messageboard")]
    public class MessageBoardController : Controller
    {
        private ITransActionRepo _transActionRepo;
        private IHttpContextAccessor _httpContextAccessor;
        public MessageBoardController(ITransActionRepo transActionRepo, IHttpContextAccessor httpContextAccessor)
        {
            _transActionRepo = transActionRepo;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet()]
        public IActionResult GetTopics()
        {
            var topics = _transActionRepo.GetTopics();
            var getTopics = Mapper.Map<IEnumerable<TopicDto>>(topics);
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
                var getTopicResult = Mapper.Map<TopicDto>(getTopic);
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

            var newTopic = Mapper.Map<TraTopic>(createTopic);


            _transActionRepo.CreateTopic(newTopic);

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var createdPointOfInterestToReturn = Mapper.Map<TopicDto>(newTopic);
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
            Mapper.Map(updateTopic, topicEntity);


            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            return GetTopic(id);
        }

        [HttpGet("{topicId}/message")]
        public IActionResult GetMessages(int topicId)
        {
            try
            {
                var getMessage = _transActionRepo.GetTopicMessages(topicId);
                if (getMessage == null)
                {
                    return NotFound();
                }
                var getMessages = Mapper.Map<IEnumerable<MessageDto>>(getMessage);
                return Ok(getMessages);
            }

            catch (Exception)
            {
                return StatusCode(500, "A problem happened while handeling your request");
            }
        }

       

        [HttpPost("{topicId}/message")]
        public IActionResult CreateMessage([FromBody] MessageDto createTopic)
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

            var newMessage = Mapper.Map<TraTopicMessage>(createTopic);


            _transActionRepo.CreateTopicMessage(newMessage);

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var createdPointOfInterestToReturn = Mapper.Map<MessageDto>(newMessage);
            return CreatedAtRoute("GetThatTopic", new { id = createdPointOfInterestToReturn.TopicId }, createdPointOfInterestToReturn);

        }

        [HttpPut("message/{id}")]
        public IActionResult MessageUpdate(int id, [FromBody] MessageUpdateDto updateMessage)
        {
            string userGuid = UserHelper.GetUserGuid(_httpContextAccessor);
            var getUser = _transActionRepo.GetUsers().FirstOrDefault(c => c.Guid == userGuid);

            var user = _transActionRepo.GetCurrentUser(getUser.Guid);
            if(user.UserId == updateMessage.UserId)
            {
                var messageEntity = _transActionRepo.GetTopicMessage(id);
                if (messageEntity == null) return NotFound();
                if (updateMessage == null) return NotFound();

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                Mapper.Map(updateMessage, messageEntity);


                if (!_transActionRepo.Save())
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var getMessage = _transActionRepo.GetTopicMessage(id);
                var getTopicResult = Mapper.Map<MessageDto>(getMessage);
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