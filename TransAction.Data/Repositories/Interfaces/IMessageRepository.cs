using System;
using System.Collections.Generic;
using System.Text;
using TransAction.Data.Models;

namespace TransAction.Data.Repositories.Interfaces
{
    public interface IMessageRepository
    {
        IEnumerable<TraTopicMessage> GetAllTopicMessages(int page, int pageSize, int topicId);
        IEnumerable<TraTopicMessage> GetAllMessages(int page, int pageSize);
        TraTopicMessage GetMessageById(int id);
        void Create(TraTopicMessage newMessages);
        void Update(TraTopicMessage updateMessage);
        void Delete(TraTopicMessage deleteMessage);
    }
}
