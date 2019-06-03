using AutoMapper;
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
            CreateMap<TraTeam, TeamDto>();
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
            CreateMap<TraTopic, TopicDto>();
            CreateMap<TraTopic, TopicUpdateDto>();

            CreateMap<TraTopicMessage, MessageDto>();
            CreateMap<TraTopicMessage, MessageUpdateDto>();
        }
    }
}
