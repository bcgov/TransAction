using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using TransAction.Data.Models;
using TransAction.Data.Repositories.Interfaces;

namespace TransAction.Data.Repositories
{
    public class TopicRepository : RepositoryBase<TraTopic>, ITopicRepRository
    {
        public TopicRepository(TransActionContext context) : base(context)
        {
        }

        public IEnumerable<TraTopic> GetAllTopics(int page, int pageSize)
        {
            if (--page < 0) page = 0;
            return FindAll().Include(x => x.TraTopicMessage).Skip(page * pageSize).Take(pageSize).ToList();
        }

        public TraTopic GetTopicById(int id)
        {
            return Find(e => e.TopicId == id).FirstOrDefault();
        }
    }
}
