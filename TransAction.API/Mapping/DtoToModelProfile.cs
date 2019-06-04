using AutoMapper;
using TransAction.Data.Models;

namespace TransAction.API.Mapping
{
    public class DtoToModelProfile : Profile
    {
        public DtoToModelProfile()
        {
            CreateMap<EventDto, TraEvent>();
            CreateMap<EventCreateDto, TraEvent>();
            CreateMap<EventUpdateDto, TraEvent>();

            // for profile 
            CreateMap<UserDto, TraUser>();
            CreateMap<UserCreateDto, TraUser>();
            CreateMap<UserUpdateDto, TraUser>();

            //for teams
            CreateMap<TeamDto, TraTeam>();
            CreateMap<TeamCreateDto, TraTeam>();
            CreateMap<TeamUpdateDto, TraTeam>();

            //for regions
            CreateMap<RegionDto, TraRegion>();
            CreateMap<RegionCreateDto, TraRegion>();
            CreateMap<RegionUpdateDto, TraRegion>();

            //for activity                
            CreateMap<ActivityDto, TraActivity>();
            CreateMap<ActivityCreateDto, TraActivity>();
            CreateMap<ActivityUpdateDto, TraActivity>();

            //for user activity
            CreateMap<UserActivityDto, TraUserActivity>();
            CreateMap<UserActivityCreateDto, TraUserActivity>();
            CreateMap<UserActivityUpdateDto, TraUserActivity>();

            //for roles
            CreateMap<RoleDto, TraRole>();
            CreateMap<RoleCreateDto, TraRole>();
            CreateMap<RoleUpdateDto, TraRole>();

            //for MemberReq
            CreateMap<MemberReqDto, TraMemberReq>();
            CreateMap<MemberReqCreateDto, TraMemberReq>();
            CreateMap<MemberReqUpdateDto, TraMemberReq>();

            //MessageBoard
            CreateMap<TopicDto, TraTopic>();
            CreateMap<TopicCreateDto, TraTopic>();
            CreateMap<TopicUpdateDto, TraTopic>();

            CreateMap<MessageDto, TraTopicMessage>();
            CreateMap<MessageCreateDto, TraTopicMessage>();
            CreateMap<MessageUpdateDto, TraTopicMessage>();
        }
    }
}
