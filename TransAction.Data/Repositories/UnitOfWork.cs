using System;
using System.Collections.Generic;
using System.Text;
using TransAction.Data.Models;
using TransAction.Data.Repositories.Interfaces;

namespace TransAction.Data.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly TransActionContext _context;

        public IEventRepository _event;
        public IEventRepository Event
        {
            get
            {
                if (_event == null)
                {
                    _event = new EventRepository(_context);
                }

                return _event;
            }
        }

        public IUserRepository _user;
        public IUserRepository User
        {
            get
            {
                if (_user == null)
                {
                    _user = new UserRepository(_context);
                }

                return _user;
            }
        }

        public IRegionRepository _region;
        public IRegionRepository Region
        {
            get
            {
                if (_region == null)
                {
                    _region = new RegionRepository(_context);
                }

                return _region;
            }
        }

        public ITeamRepository _team;
        public ITeamRepository Team
        {
            get
            {
                if (_team == null)
                {
                    _team = new TeamRepository(_context);
                }

                return _team;
            }
        }

        public IMessageRepository _message;
        public IMessageRepository Message
        {
            get
            {
                if (_message == null)
                {
                    _message = new MessageRepository(_context);
                }

                return _message;
            }
        }
        public ITopicRepRository _topic;
        public ITopicRepRository Topic
        {
            get
            {
                if (_topic == null)
                {
                    _topic = new TopicRepository(_context);
                }

                return _topic;
            }
        }

        public IActivityRepository _activty;
        public IActivityRepository Activity
        {
            get
            {
                if (_activty == null)
                {
                    _activty = new ActivityRepository(_context);
                }

                return _activty;
            }
        }
        public UnitOfWork(TransActionContext context)
        {
            _context = context;
        }

        public bool Save()
        {
            return (_context.SaveChanges() >= 0);
        }
    }
}
