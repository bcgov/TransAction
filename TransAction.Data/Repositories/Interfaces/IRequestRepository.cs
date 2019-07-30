using System;
using System.Collections.Generic;
using System.Text;
using TransAction.Data.Models;

namespace TransAction.Data.Repositories.Interfaces
{
    public interface IRequestRepository
    {
        IEnumerable<TraMemberReq> GetAllReq(int page, int pageSize);
        TraMemberReq GetReqById(int id);
        void Create(TraMemberReq newRequest);
        void Update(TraMemberReq updateRequest);
        IEnumerable<MemberReqDto> CurrentTeamReq(int teamId);
        int Count();
    }
}
