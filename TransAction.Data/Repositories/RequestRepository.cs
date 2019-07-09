using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using TransAction.Data.Models;
using TransAction.Data.Repositories.Interfaces;

namespace TransAction.Data.Repositories
{
    public class RequestRepository : RepositoryBase<TraMemberReq>, IRequestRepository
    {
        public RequestRepository(TransActionContext repositoryContext) : base(repositoryContext)
        {
        }

        public IEnumerable<MemberReqDto> CurrentTeamReq(int teamId)
        {
            var teamRequests = Find()
                .Where(p => p.TeamId == teamId)
                .Where(p => p.IsActive == true)
                    .Select(x => new MemberReqDto()
                    {
                        MemberReqId = x.MemberReqId,
                        TeamId = teamId,
                        UserId = x.UserId,
                        IsActive = x.IsActive,
                        ConcurrencyControlNumber = x.ConcurrencyControlNumber
                    })
                    .ToList();



            return teamRequests;
        }

        public IEnumerable<TraMemberReq> GetAllReq(int page, int pageSize)
        {
            if (--page < 0) page = 0;
            return FindAll().Where(x => x.IsActive == true).OrderBy(c => c.MemberReqId).Skip(page * pageSize).Take(pageSize).ToList();
        }

        public TraMemberReq GetReqById(int id)
        {
            return Find().FirstOrDefault(c => c.MemberReqId == id);
        }
    }
}
