﻿using System;
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
