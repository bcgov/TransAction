using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using TransAction.Data.Repositories.Interfaces;
using TransAction.Data.Services;

namespace TransAction.API.Controllers
{
    public abstract class BaseController : Controller
    {
        //protected readonly ITransActionRepo _transActionRepo;
        protected readonly IUnitOfWork _unitOfWork;
        protected readonly IHttpContextAccessor _httpContextAccessor;
        protected readonly IMapper _mapper;
        protected readonly ILogger _logger;

        public BaseController(IHttpContextAccessor httpContextAccessor, ILogger logger, IUnitOfWork unitOfWork, IMapper mapper)
        {

            _httpContextAccessor = httpContextAccessor;
            //_transActionRepo = httpContextAccessor.HttpContext.RequestServices.GetService<ITransActionRepo>();
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }
    }
}
