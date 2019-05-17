using AutoMapper;
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
            if (_transActionRepo.RoleExists(createTopic.Title))
            {
                return BadRequest();
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

        [HttpGet("{topicId}/message/{messageId}")]
        public IActionResult GetMessage(int topicId, int messageId)
        {
            try
            {
                var getMessage = _transActionRepo.GetTopicMessage(topicId, messageId);
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

            var newTopic = Mapper.Map<TraTopic>(createTopic);


            _transActionRepo.CreateTopic(newTopic);

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var createdPointOfInterestToReturn = Mapper.Map<TopicDto>(newTopic);
            return CreatedAtRoute("GetThatTopic", new { id = createdPointOfInterestToReturn.TopicId }, createdPointOfInterestToReturn);

        }

    }
}