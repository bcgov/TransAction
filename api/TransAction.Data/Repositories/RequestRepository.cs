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

        public int Count()
        {
            return Find(x => x.IsActive == true).OrderBy(c => c.MemberReqId).Count();
        }

        public IEnumerable<TraMemberReq> GetByTeamId(int teamId)
        {
            var teamRequests = Find(p => p.TeamId == teamId && p.IsActive == true).ToList();

            return teamRequests;
        }

        public IEnumerable<TraMemberReq> GetByUserId(int userId)
        {
            var teamRequests = Find(p => p.UserId == userId && p.IsActive == true).ToList();

            return teamRequests;
        }

        public IEnumerable<TraMemberReq> GetAllReq(int page, int pageSize)
        {
            if (--page < 0) page = 0;
            return Find(x => x.IsActive == true).OrderBy(c => c.MemberReqId).Skip(page * pageSize).Take(pageSize).ToList();
        }

        public TraMemberReq GetReqById(int id)
        {
            return Find(c => c.MemberReqId == id).FirstOrDefault();
        }
    }
}
