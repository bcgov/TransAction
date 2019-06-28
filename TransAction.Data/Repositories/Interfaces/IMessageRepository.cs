using System;
using System.Collections.Generic;
using System.Text;
using TransAction.Data.Models;

namespace TransAction.Data.Repositories.Interfaces
{
    public interface IMessageRepository
    {
        IEnumerable<TraTopicMessage> GetAllMessages(int page, int pageSize, int topicId);
        TraTopicMessage GetMessageById(int id);
        void Create(TraTopicMessage newMessages);
    }
}
