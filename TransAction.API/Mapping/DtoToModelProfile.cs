using AutoMapper;
using TransAction.Data.Models;

namespace TransAction.API.Mapping
{
    public class DtoToModelProfile : Profile
    {
        public DtoToModelProfile()
        {
            CreateMap<EventDto, TraEvent>();
            CreateMap<EventCreateDto, TraEvent>()
                .ForMember(entity => entity.Description, opt => opt.MapFrom(dto => dto.Description.Trim()))
                .ForMember(entity => entity.Name, opt => opt.MapFrom(dto => dto.Name.Trim()));
            CreateMap<EventUpdateDto, TraEvent>()
                .ForMember(entity => entity.Description, opt => opt.MapFrom(dto => dto.Description.Trim()))
                .ForMember(entity => entity.Name, opt => opt.MapFrom(dto => dto.Name.Trim()));

            // for profile
            CreateMap<UserDto, TraUser>();
            CreateMap<UserCreateDto, TraUser>()
                .ForMember(entity => entity.Fname, opt => opt.MapFrom(dto => dto.Fname.Trim()))
                .ForMember(entity => entity.Lname, opt => opt.MapFrom(dto => dto.Lname.Trim()));
            CreateMap<UserUpdateDto, TraUser>()
                .ForMember(entity => entity.Fname, opt => opt.MapFrom(dto => dto.Fname.Trim()))
                .ForMember(entity => entity.Lname, opt => opt.MapFrom(dto => dto.Lname.Trim()));

            //for teams
            CreateMap<TeamDto, TraTeam>();
            CreateMap<TeamCreateDto, TraTeam>()
                .ForMember(entity => entity.Description, opt => opt.MapFrom(dto => dto.Description.Trim()))
                .ForMember(entity => entity.Name, opt => opt.MapFrom(dto => dto.Name.Trim()));
            CreateMap<TeamUpdateDto, TraTeam>()
                .ForMember(entity => entity.Description, opt => opt.MapFrom(dto => dto.Description.Trim()))
                .ForMember(entity => entity.Name, opt => opt.MapFrom(dto => dto.Name.Trim()));

            //for regions
            CreateMap<RegionDto, TraRegion>();
            CreateMap<RegionCreateDto, TraRegion>()
                .ForMember(entity => entity.Description, opt => opt.MapFrom(dto => dto.Description.Trim()))
                .ForMember(entity => entity.Name, opt => opt.MapFrom(dto => dto.Name.Trim()));
            CreateMap<RegionUpdateDto, TraRegion>()
                .ForMember(entity => entity.Description, opt => opt.MapFrom(dto => dto.Description.Trim()))
                .ForMember(entity => entity.Name, opt => opt.MapFrom(dto => dto.Name.Trim()));

            //for activity
            CreateMap<ActivityDto, TraActivity>();
            CreateMap<ActivityCreateDto, TraActivity>()
                .ForMember(entity => entity.Description, opt => opt.MapFrom(dto => dto.Description.Trim()))
                .ForMember(entity => entity.Name, opt => opt.MapFrom(dto => dto.Name.Trim()));
            CreateMap<ActivityUpdateDto, TraActivity>()
                .ForMember(entity => entity.Description, opt => opt.MapFrom(dto => dto.Description.Trim()))
                .ForMember(entity => entity.Name, opt => opt.MapFrom(dto => dto.Name.Trim()));

            //for user activity
            CreateMap<UserActivityDto, TraUserActivity>();
            CreateMap<UserActivityCreateDto, TraUserActivity>()
                .ForMember(entity => entity.Description, opt => opt.MapFrom(dto => dto.Description.Trim()))
                .ForMember(entity => entity.Name, opt => opt.MapFrom(dto => dto.Name.Trim()));
            CreateMap<UserActivityUpdateDto, TraUserActivity>()
                .ForMember(entity => entity.Description, opt => opt.MapFrom(dto => dto.Description.Trim()))
                .ForMember(entity => entity.Name, opt => opt.MapFrom(dto => dto.Name.Trim()));

            //for roles
            CreateMap<RoleDto, TraRole>();
            CreateMap<RoleCreateDto, TraRole>()
                .ForMember(entity => entity.Description, opt => opt.MapFrom(dto => dto.Description.Trim()))
                .ForMember(entity => entity.Name, opt => opt.MapFrom(dto => dto.Name.Trim()));
            CreateMap<RoleUpdateDto, TraRole>()
                .ForMember(entity => entity.Description, opt => opt.MapFrom(dto => dto.Description.Trim()))
                .ForMember(entity => entity.Name, opt => opt.MapFrom(dto => dto.Name.Trim()));

            //for MemberReq
            CreateMap<MemberReqDto, TraMemberReq>();
            CreateMap<MemberReqCreateDto, TraMemberReq>();
            CreateMap<MemberReqUpdateDto, TraMemberReq>();

            //MessageBoard
            CreateMap<TopicDto, TraTopic>();
            CreateMap<TopicCreateDto, TraTopic>()
                .ForMember(entity => entity.Title, opt => opt.MapFrom(dto => dto.Title.Trim()));
            CreateMap<TopicUpdateDto, TraTopic>()
                .ForMember(entity => entity.Title, opt => opt.MapFrom(dto => dto.Title.Trim()));

            CreateMap<MessageDto, TraTopicMessage>();
            CreateMap<MessageCreateDto, TraTopicMessage>()
                .ForMember(entity => entity.Body, opt => opt.MapFrom(dto => dto.Body.Trim()));
            CreateMap<MessageUpdateDto, TraTopicMessage>()
                .ForMember(entity => entity.Body, opt => opt.MapFrom(dto => dto.Body.Trim()));
        }
    }
}
