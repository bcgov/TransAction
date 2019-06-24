using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using TransAction.API.Authorization;
using TransAction.Data.Models;

namespace TransAction.API.Controllers
{
    [Route("api/Regions")]
    public class RegionController : BaseController
    {

        public RegionController(IHttpContextAccessor httpContextAccessor, ILogger<RegionController> logger) :
            base(httpContextAccessor, logger)
        { }


        [HttpGet()]
        public IActionResult GetRegions()
        {
            var regions = _transActionRepo.GetRegions();
            var getRegions = _mapper.Map<IEnumerable<RegionDto>>(regions);
            return Ok(getRegions);

        }


        [HttpGet("{id}", Name = "GetThatRegion")]
        public IActionResult GetRegionById(int id)
        {
            try
            {
                var getRegions = _transActionRepo.GetRegions().FirstOrDefault(c => c.RegionId == id);

                if (getRegions == null)
                {
                    return NotFound();
                }
                var getRegion = _transActionRepo.GetRegion(id);
                var getRegionResult = _mapper.Map<RegionDto>(getRegion);
                return Ok(getRegionResult);

            }

            catch (Exception)
            {
                return StatusCode(500, "A problem happened while handeling your request");
            }

        }
        [ClaimRequirement(AuthorizationTypes.ADMIN_CLAIM)]
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

            var newRegion = _mapper.Map<TraRegion>(createRegion);

            _transActionRepo.CreateRegion(newRegion);


            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var createdPointOfInterestToReturn = _mapper.Map<RegionDto>(newRegion);
            return CreatedAtRoute("GetThatRegion", new { id = createdPointOfInterestToReturn.RegionId }, createdPointOfInterestToReturn);
            
        }

        [ClaimRequirement(AuthorizationTypes.ADMIN_CLAIM)]
        [HttpPut("{id}")]
        public IActionResult UpdateRegion(int id, [FromBody] RegionUpdateDto updateRegion)
        {
            var regionEntity = _transActionRepo.GetRegion(id);
            if (regionEntity == null) return NotFound();
            if (updateRegion == null) return NotFound();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _mapper.Map(updateRegion, regionEntity);


            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            return NoContent();
        }



    }
}