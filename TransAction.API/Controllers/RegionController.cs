using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using TransAction.API.Authorization;
using TransAction.Data.Models;
using TransAction.Data.Repositories.Interfaces;
using AutoMapper;
using TransAction.API.Responses;

namespace TransAction.API.Controllers
{
    [Route("api/Regions")]
    public class RegionController : BaseController
    {

        public RegionController(IHttpContextAccessor httpContextAccessor, ILogger<ActivityController> logger, IUnitOfWork unitOfWork, IMapper mapper) :
            base(httpContextAccessor, logger, unitOfWork, mapper)
        { }


        [HttpGet()]
        public IActionResult GetRegions(int page = 1, int pageSize = 25)
        {
            var regions = _unitOfWork.Region.GetAllRegions(page, pageSize);
            var getRegions = _mapper.Map<IEnumerable<RegionDto>>(regions);
            return StatusCode(200, new TransActionPagedResponse(getRegions, page, pageSize, _unitOfWork.Region.Count()));

        }


        [HttpGet("{id}", Name = "GetRegion")]
        public IActionResult GetRegionById(int id)
        {
            try
            {
                var getRegions = _unitOfWork.Region.GetRegionById(id);

                if (getRegions == null)
                {
                    return StatusCode(404, new TransActionResponse("Region Not Found"));
                }
                var getRegionResult = _mapper.Map<RegionDto>(getRegions);
                return StatusCode(200, new TransActionResponse(getRegionResult));

            }

            catch (Exception)
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handeling your request"));
            }

        }
        [ClaimRequirement(AuthorizationTypes.ADMIN_CLAIM)]
        [HttpPost()]
        public IActionResult CreateRegion([FromBody] RegionCreateDto createRegion)
        {
            if (createRegion == null)
            {
                return BadRequest(new TransActionResponse("No Region entered."));
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(new TransActionResponse(ModelState.ToString()));
            }
            if (_unitOfWork.Region.RegionExists(createRegion.Name))
            {
                return BadRequest(new TransActionResponse("Region Already Exists"));
            }

            var newRegion = _mapper.Map<TraRegion>(createRegion);
            _unitOfWork.Region.Create(newRegion);


            if (!_unitOfWork.Save())
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request."));
            }

            var createRegionResult = _mapper.Map<RegionDto>(newRegion);
            return CreatedAtRoute("GetRegion", new { id = createRegionResult.RegionId }, new TransActionResponse(createRegionResult));

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
                return BadRequest(new TransActionResponse(ModelState.ToString()));
            }
            _mapper.Map(updateRegion, regionEntity);
            _unitOfWork.Region.Update(regionEntity);

            if (!_unitOfWork.Save())
            {
                return StatusCode(500, new TransActionResponse("A problem happened while handling your request."));
            }

            return NoContent();
        }



    }
}