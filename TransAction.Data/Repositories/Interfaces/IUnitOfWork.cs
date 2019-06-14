namespace TransAction.Data.Repositories.Interfaces
{
    public interface IUnitOfWork
    {
        IEventRepository Event { get; }

        bool Save();
    }
}
