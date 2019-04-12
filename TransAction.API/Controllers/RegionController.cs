using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using TransAction.Data.Models;
using TransAction.Data.Services;

namespace TransAction.API.Controllers
{
    [Route("api/Regions")]
    public class RegionController : Controller
    {
        private ITransActionRepo _transActionRepo;
        public RegionController(ITransActionRepo transActionRepo, IHttpContextAccessor httpContextAccessor)
        {
            _transActionRepo = transActionRepo;
        }


        [HttpGet()]
        public IActionResult GetRegions()
        {
            var regions = _transActionRepo.GetRegions();
            var getRegions = Mapper.Map<IEnumerable<RegionDto>>(regions);
            return Ok(getRegions);

        }


        [HttpGet("{id}", Name = "GetThatRegion")]
        public IActionResult GetRegion(int id)
        {
            try
            {
                var getRegions = _transActionRepo.GetRegions().FirstOrDefault(c => c.RegionId == id);

                if (getRegions == null)
                {
                    return NotFound();
                }
                var getRegion = _transActionRepo.GetRegion(id);
                var getRegionResult = Mapper.Map<RegionDto>(getRegion);
                return Ok(getRegionResult);

            }

            catch (Exception)
            {
                return StatusCode(500, "A problem happened while handeling your request");
            }

        }

        [HttpPost()]
        public IActionResult CreateRegion([FromBody] RegionCreateDto createRegion)
        {
            if (createRegion == null)
            {
                return BadRequest();
            }
            if (createRegion.Description == null || createRegion.Name == null)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (_transActionRepo.RegionExists(createRegion.Name))
            {
                return BadRequest();
            }

            var newRegion = Mapper.Map<TraRegion>(createRegion);

            //newEvent.DbCreateTimestamp = DateTime.Now;
            // newEvent.DbLastUpdateTimestamp = newEvent.DbCreateTimestamp;


            _transActionRepo.CreateRegion(newRegion);

            newRegion.DbCreateUserid = "Test User";
            newRegion.DbLastUpdateUserid = "Test User";


            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var createdPointOfInterestToReturn = Mapper.Map<RegionDto>(newRegion);
            return CreatedAtRoute("GetThatRegion", new { id = createdPointOfInterestToReturn.RegionId }, createdPointOfInterestToReturn);
            
        }

        [HttpPut("{id}")]
        public IActionResult RegionUpdate(int id, [FromBody] RegionUpdateDto updateRegion)
        {
            var regionEntity = _transActionRepo.GetRegion(id);
            if (regionEntity == null) return NotFound();
            if (updateRegion == null) return NotFound();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            //   eventEntity.DbLastUpdateTimestamp = DateTime.Now;
            regionEntity.DbLastUpdateUserid = "Test User";
            Mapper.Map(updateRegion, regionEntity);


            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            return NoContent();
        }



    }
}