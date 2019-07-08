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
        public IActionResult GetRegions(int page = 1, int pageSize = 25)
        {
            var regions = _unitOfWork.Region.GetAllRegions(page, pageSize);
            var getRegions = _mapper.Map<IEnumerable<RegionDto>>(regions);
            return Ok(getRegions);

        }


        [HttpGet("{id}", Name = "GetRegion")]
        public IActionResult GetRegionById(int id)
        {
            try
            {
                var getRegions = _unitOfWork.Region.GetRegionById(id);

                if (getRegions == null)
                {
                    return NotFound();
                }
                var getRegionResult = _mapper.Map<RegionDto>(getRegions);
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
            if (_unitOfWork.Region.RegionExists(createRegion.Name))
            {
                return BadRequest();
            }

            var newRegion = _mapper.Map<TraRegion>(createRegion);
            _unitOfWork.Region.Create(newRegion);


            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            var createRegionResult = _mapper.Map<RegionDto>(newRegion);
            return CreatedAtRoute("GetRegion", new { id = createRegionResult.RegionId }, createRegionResult);

        }

        [ClaimRequirement(AuthorizationTypes.ADMIN_CLAIM)]
        [HttpPut("{id}")]
        public IActionResult UpdateRegion(int id, [FromBody] RegionUpdateDto updateRegion)
        {
            var regionEntity = _unitOfWork.Region.GetRegionById(id);
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