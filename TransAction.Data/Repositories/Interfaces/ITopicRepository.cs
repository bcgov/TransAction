using System;
using System.Collections.Generic;
using System.Text;
using TransAction.Data.Models;

namespace TransAction.Data.Repositories.Interfaces
{
    public interface ITopicRepRository
    {
        IEnumerable<TraTopic> GetAllTopics(int page, int pageSize);
        TraTopic GetTopicById(int id);
        void Create(TraTopic newTopic);
        void Update(TraTopic updateTopic);
        void Delete(TraTopic deleteTopic);
        TraTopic GetTopicByTitle(string title);

    }
}
