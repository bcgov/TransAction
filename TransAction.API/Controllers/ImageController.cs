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
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private ITransActionRepo _transActionRepo;
        private IHttpContextAccessor _httpContextAccessor;

        private static readonly string JPEG = "image/jpeg";
        private static readonly string PNG = "image/png";
        private static readonly double MAX_SIZE = 256.0;

        public ImageController(ITransActionRepo transActionRepo, IHttpContextAccessor httpContextAccessor)
        {
            _transActionRepo = transActionRepo;
            _httpContextAccessor = httpContextAccessor;
        }

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

        [AllowAnonymous]
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

        [HttpPost()]
        public IActionResult UploadProfileImage([FromForm]ImagePostDto model)
        {
            if (model.TeamId == null && model.UserId == null)
            {
                return BadRequest("Need to specify either User Id or Team Id.");
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

            byte[] bytes = null;
            using (var memoryStream = new MemoryStream())
            {
                model.Data.CopyTo(memoryStream);
                bytes = memoryStream.ToArray();

                using (Image<Rgba32> image = Image.Load(bytes))
                {
                    int maxDimension = Math.Max(image.Width, image.Height);

                    if (maxDimension > MAX_SIZE)
                    {
                        double ratio = MAX_SIZE / maxDimension;
                        image.Mutate(x => x.Resize(Convert.ToInt32(image.Width * ratio), Convert.ToInt32(image.Height * ratio)));
                    }

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

            traImage.Data = bytes;
            traImage.UserId = model.UserId;
            traImage.Guid = Guid.NewGuid().ToString();
            traImage.Filename = model.Data.FileName;
            traImage.Filesize = model.Data.Length;
            traImage.ContentType = model.Data.ContentType;

            _transActionRepo.AddProfileImage(traImage);

            if (!_transActionRepo.Save())
            {
                return StatusCode(500, "Unable to save image to database.");
            }

            return Ok();
        }
    }
}