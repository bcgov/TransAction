using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using TransAction.Data.Models;
using TransAction.Data.Services;

namespace TransAction.API.Controllers
{
    [Route("api/images")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private readonly ITransActionRepo _transActionRepo;
        private readonly IHttpContextAccessor _httpContextAccessor;

        private static readonly string JPEG = "image/jpeg";
        private static readonly string PNG = "image/png";
        private static readonly double MAX_SIZE = 512.0;

        public ImageController(ITransActionRepo transActionRepo, IHttpContextAccessor httpContextAccessor)
        {
            _transActionRepo = transActionRepo;
            _httpContextAccessor = httpContextAccessor;
        }

        [AllowAnonymous]
        [HttpGet("{guid}", Name = "GetImageByGuid")]
        public IActionResult GetImageByGuid(string guid)
        {
            TraImage image = null;

            try
            {
                image = _transActionRepo.GetProfileImage(guid);

                if (image == null)
                    return NotFound();
            }
            catch (Exception e)
            {
                throw e;
            }


            return File(image.Data, image.ContentType, image.Filename);
        }

        [HttpGet("user/{id}", Name = "GetImageByUserId")]
        public IActionResult GetImageByUserId(int id)
        {
            TraImage image = null;

            try
            {
                image = _transActionRepo.GetUserProfileImage(id);

                if (image == null)
                    return NotFound();
            }
            catch (Exception e)
            {
                throw e;
            }

            return File(image.Data, image.ContentType, image.Filename);
        }

        [HttpGet("user/{id}", Name = "GetImageByTeamId")]
        public IActionResult GetImageByTeamId(int id)
        {
            TraImage image = null;

            try
            {
                image = _transActionRepo.GetTeamProfileImage(id);

                if (image == null)
                    return NotFound();
            }
            catch (Exception e)
            {
                throw e;
            }

            return File(image.Data, image.ContentType, image.Filename);
        }

        [HttpPost()]
        public IActionResult UploadProfileImage([FromForm]ImagePostDto model)
        {
            bool newRecord = true;

            if (model.TeamId == null && model.UserId == null)
            {
                return BadRequest("Need to specify either User Id or Team Id.");
            }

            if (model.TeamId != null && model.UserId != null)
            {
                return BadRequest("Do not specify both User Id and Team Id.");
            }

            if (model.Data.ContentType != JPEG && model.Data.ContentType != PNG)
            {
                return BadRequest("Unsupported file format.  Only jpeg or png are supported.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            TraImage traImage = new TraImage();

            if (model.UserId != null)
            {
                var image = _transActionRepo.GetUserProfileImage(model.UserId.Value);

                if (image != null)
                {
                    traImage = image;
                    newRecord = false;
                }
            }

            if (model.TeamId != null)
            {
                var image = _transActionRepo.GetTeamProfileImage(model.TeamId.Value);

                if (image != null)
                {
                    traImage = image;
                    newRecord = false;
                }
            }

            byte[] bytes = null;
            using (var memoryStream = new MemoryStream())
            {
                model.Data.CopyTo(memoryStream);
                bytes = memoryStream.ToArray();

                using (Image<Rgba32> image = Image.Load(bytes))
                {
                    int maxWidthOrLength = Math.Max(image.Width, image.Height);

                    if (maxWidthOrLength > MAX_SIZE)
                    {
                        double ratio = MAX_SIZE / maxWidthOrLength;
                        image.Mutate(x => x.Resize(Convert.ToInt32(image.Width * ratio), Convert.ToInt32(image.Height * ratio)));
                    }

                    memoryStream.SetLength(0);

                    if (model.Data.ContentType == JPEG)
                    {
                        image.SaveAsJpeg(memoryStream);
                    }
                    else
                    {
                        image.SaveAsPng(memoryStream);
                    }

                    bytes = memoryStream.ToArray();

                    traImage.Width = image.Width;
                    traImage.Height = image.Height;
                }
            }

            traImage.UserId = model.UserId;
            traImage.TeamId = model.TeamId;
            traImage.Data = bytes;
            traImage.Guid = Guid.NewGuid().ToString();
            traImage.Filename = model.Data.FileName;
            traImage.Filesize = model.Data.Length;
            traImage.ContentType = model.Data.ContentType;

            if (newRecord)
                _transActionRepo.AddProfileImage(traImage);

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "Unable to save image to database.");
            }

            return Ok();
        }
    }
}