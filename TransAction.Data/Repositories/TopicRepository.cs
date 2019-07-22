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

        public int Count()
        {
            return FindAll().Include(x => x.TraTopicMessage).Count();
        }

        public IEnumerable<TraTopic> GetAllTopics(int page, int pageSize)
        {
            if (--page < 0) page = 0;
            return FindAll().Include(x => x.TraTopicMessage).ThenInclude(m => m.User).Skip(page * pageSize).Take(pageSize).ToList();
        }

        public TraTopic GetTopicById(int id)
        {
            return Find(e => e.TopicId == id).Include(x => x.TraTopicMessage).FirstOrDefault();
        }

        public TraTopic GetTopicByTitle(string title)
        {
            return Find(e => e.Title == title).Include(x => x.TraTopicMessage).FirstOrDefault();
        }
    }
}
