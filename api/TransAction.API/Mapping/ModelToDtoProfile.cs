using AutoMapper;
using System.Linq;
using TransAction.Data.Models;

namespace TransAction.API.Mapping
{
    public class ModelToDtoProfile : Profile
    {
        public ModelToDtoProfile()
        {
            CreateMap<TraEvent, EventDto>();
            CreateMap<TraEvent, EventUpdateDto>();

            CreateMap<TraImage, ImageDto>();

            // for profile
            CreateMap<TraUser, UserDto>();
            CreateMap<TraUserView, UserDto>();
            CreateMap<TraUser, UserUpdateDto>();

            //for teams
            CreateMap<TraTeam, TeamDto>()
                .ForMember(dto => dto.TeamLeaderName, opt => opt.MapFrom(model => $"{model.User.Fname} {model.User.Lname}"))
                .ForMember(dto => dto.TeamMemberIds, opt => opt.MapFrom(model => model.TraUser.Select(x => x.UserId)))
                .ForMember(dto => dto.NumMembers, opt => opt.MapFrom(model => model.TraUser.Count));
            CreateMap<TraTeam, TeamUpdateDto>();

            //for regions
            CreateMap<TraRegion, RegionDto>();
            CreateMap<TraRegion, RegionUpdateDto>();

            //for activity
            CreateMap<TraActivity, ActivityDto>();
            CreateMap<TraActivity, ActivityUpdateDto>();

            //for user activity
            CreateMap<TraUserActivity, UserActivityDto>();
            CreateMap<TraUserActivity, UserActivityUpdateDto>();

            //for roles
            CreateMap<TraRole, RoleDto>();
            CreateMap<TraRole, RoleUpdateDto>();

            //for MemberReq

            CreateMap<TraMemberReq, MemberReqDto>();
            CreateMap<TraMemberReq, MemberReqUpdateDto>();

            //MessageBoard
            CreateMap<TraTopic, TopicDto>()
                .ForMember(dto => dto.PostCount, opt => opt.MapFrom(model => model.TraTopicMessage.Count))
                .ForMember(dto => dto.UserName, opt => opt.MapFrom(model => $"{model.User.Fname} {model.User.Lname}"));
            //CreateMap<TraTopic, TopicUpdateDto>();

            CreateMap<TraTopicMessage, MessageDto>()
                .ForMember(dto => dto.UserName, opt => opt.MapFrom(model => $"{model.User.Fname} {model.User.Lname}")); ;
            //CreateMap<TraTopicMessage, MessageUpdateDto>();
        }
    }
}
