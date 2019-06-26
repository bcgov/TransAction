namespace TransAction.Data.Repositories.Interfaces
{
    public interface IUnitOfWork
    {
        IEventRepository Event { get; }
        IUserRepository User { get; }
        ITeamRepository Team { get; }
        bool Save();
    }
}
