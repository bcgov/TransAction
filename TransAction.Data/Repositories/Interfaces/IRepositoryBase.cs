using System;
using System.Linq;
using System.Linq.Expressions;

namespace TransAction.Data.Repositories.Interfaces
{
    public interface IRepositoryBase<T>
    {
        IQueryable<T> FindAll();
        IQueryable<T> Find();
        IQueryable<T> Find(Expression<Func<T, bool>> expression);
        void Create(T entity);
        void Delete(T entity);
    }
}
