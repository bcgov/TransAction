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
            return FindAll().Include(x => x.TraTopicMessage).ThenInclude(m => m.User).Skip(page * pageSize).Take(pageSize).ToList();
        }

        public TraTopic GetTopicById(int id)
        {
            return Find().Include(x => x.TraTopicMessage).FirstOrDefault(e => e.TopicId == id);
        }

        public TraTopic GetTopicByTitle(string title)
        {
            return Find().Include(x => x.TraTopicMessage).FirstOrDefault(e => e.Title == title);
        }
    }
}
