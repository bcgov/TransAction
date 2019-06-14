using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;
using TransAction.Data.Models;
using TransAction.Data.Repositories.Interfaces;

namespace TransAction.Data.Repositories
{
    public abstract class RepositoryBase<T> : IRepositoryBase<T> where T : class
    {
        protected TransActionContext _context { get; set; }

        public RepositoryBase(TransActionContext repositoryContext)
        {
            _context = repositoryContext;
        }

        public IQueryable<T> FindAll()
        {
            // AsNoTracking() disables EF oject change tracking.  Slight faster
            return _context.Set<T>();
        }
        public IQueryable<T> Find()
        {
            return _context.Set<T>();
        }

        public IQueryable<T> Find(Expression<Func<T, bool>> expression)
        {
            return _context.Set<T>().Where(expression);
        }

        public void Create(T entity)
        {
            _context.Set<T>().Add(entity);
        }

        public void Delete(T entity)
        {
            _context.Set<T>().Remove(entity);
        }
    }
}
