using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace TransAction.Data.Models
{
    public partial class TransActionContext : DbContext
    {
        public TransActionContext()
        {
        }

        public TransActionContext(DbContextOptions<TransActionContext> options)
            : base(options)
        {
        }

        public virtual DbSet<TraActivity> TraActivity { get; set; }
        public virtual DbSet<TraEvent> TraEvent { get; set; }
        public virtual DbSet<TraEventTeam> TraEventTeam { get; set; }
        public virtual DbSet<TraEventUser> TraEventUser { get; set; }
        public virtual DbSet<TraMemberReq> TraMemberReq { get; set; }
        public virtual DbSet<TraRole> TraRole { get; set; }
        public virtual DbSet<TraTeam> TraTeam { get; set; }
        public virtual DbSet<TraTopic> TraTopic { get; set; }
        public virtual DbSet<TraTopicMessage> TraTopicMessage { get; set; }
        public virtual DbSet<TraUser> TraUser { get; set; }
        public virtual DbSet<TraUserActivity> TraUserActivity { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=NC057936\\SQLExpress;Database=TransActionPractice;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TraActivity>(entity =>
            {
                entity.HasKey(e => e.ActivityId);

                entity.ToTable("TRA_ACTIVITY");

                entity.Property(e => e.ActivityId).HasColumnName("ACTIVITY_ID");

                entity.Property(e => e.CreatedByDate)
                    .HasColumnName("CREATED_BY_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.CreatedByUser)
                    .HasColumnName("CREATED_BY_USER")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Description)
                    .HasColumnName("DESCRIPTION")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.EffectiveEndDate)
                    .HasColumnName("EFFECTIVE_END_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.EffectiveStartDate)
                    .HasColumnName("EFFECTIVE_START_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.Intensity).HasColumnName("INTENSITY");

                entity.Property(e => e.LastUpdatedByDate)
                    .HasColumnName("LAST_UPDATED_BY_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.LastUpdatedByUser)
                    .HasColumnName("LAST_UPDATED_BY_USER")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("NAME")
                    .HasMaxLength(1024)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<TraEvent>(entity =>
            {
                entity.HasKey(e => e.EventId)
                    .HasName("PK_EVENT");

                entity.ToTable("TRA_EVENT");

                entity.Property(e => e.EventId).HasColumnName("EVENT_ID");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.DbCreateTimestamp)
                    .HasColumnName("DB_CREATE_TIMESTAMP")
                    .HasColumnType("datetime");

                entity.Property(e => e.DbCreateUserid)
                    .IsRequired()
                    .HasColumnName("DB_CREATE_USERID")
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.DbLastUpdateTimestamp)
                    .HasColumnName("DB_LAST_UPDATE_TIMESTAMP")
                    .HasColumnType("datetime");

                entity.Property(e => e.DbLastUpdateUserid)
                    .IsRequired()
                    .HasColumnName("DB_LAST_UPDATE_USERID")
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasColumnName("DESCRIPTION")
                    .HasColumnType("text");

                entity.Property(e => e.EndDate)
                    .HasColumnName("END_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("NAME")
                    .HasMaxLength(1024)
                    .IsUnicode(false);

                entity.Property(e => e.StartDate)
                    .HasColumnName("START_DATE")
                    .HasColumnType("datetime");
            });

            modelBuilder.Entity<TraEventTeam>(entity =>
            {
                entity.HasKey(e => e.EventTeamsId);

                entity.ToTable("TRA_EVENT_TEAM");

                entity.HasIndex(e => e.EventId)
                    .HasName("IX_FK_EVENT_EVENT_TEAMS");

                entity.HasIndex(e => e.TeamId)
                    .HasName("IX_FK_EVENT_TEAMS_TEAM");

                entity.Property(e => e.EventTeamsId).HasColumnName("EVENT_TEAMS_ID");

                entity.Property(e => e.CreatedByDate)
                    .HasColumnName("CREATED_BY_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.CreatedByUser)
                    .HasColumnName("CREATED_BY_USER")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.EffectiveEndDate)
                    .HasColumnName("EFFECTIVE_END_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.EffectiveStartDate)
                    .HasColumnName("EFFECTIVE_START_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.EventId).HasColumnName("EVENT_ID");

                entity.Property(e => e.LastUpdatedByDate)
                    .HasColumnName("LAST_UPDATED_BY_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.LastUpdatedByUser)
                    .HasColumnName("LAST_UPDATED_BY_USER")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.TeamId).HasColumnName("TEAM_ID");

                entity.HasOne(d => d.Event)
                    .WithMany(p => p.TraEventTeam)
                    .HasForeignKey(d => d.EventId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_EVENT_EVENT_TEAMS");

                entity.HasOne(d => d.Team)
                    .WithMany(p => p.TraEventTeam)
                    .HasForeignKey(d => d.TeamId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_EVENT_TEAMS_TEAM");
            });

            modelBuilder.Entity<TraEventUser>(entity =>
            {
                entity.HasKey(e => e.EventUsersId);

                entity.ToTable("TRA_EVENT_USER");

                entity.HasIndex(e => e.EventId)
                    .HasName("IX_FK_EVENT_EVENT_USERS");

                entity.HasIndex(e => e.UserId)
                    .HasName("IX_FK_EVENT_USER_USER");

                entity.Property(e => e.EventUsersId).HasColumnName("EVENT_USERS_ID");

                entity.Property(e => e.CreatedByDate)
                    .HasColumnName("CREATED_BY_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.CreatedByUser)
                    .HasColumnName("CREATED_BY_USER")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.EffectiveEndDate)
                    .HasColumnName("EFFECTIVE_END_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.EffectiveStartDate)
                    .HasColumnName("EFFECTIVE_START_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.EventId).HasColumnName("EVENT_ID");

                entity.Property(e => e.LastUpdatedByDate)
                    .HasColumnName("LAST_UPDATED_BY_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.LastUpdatedByUser)
                    .HasColumnName("LAST_UPDATED_BY_USER")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.UserId).HasColumnName("USER_ID");

                entity.HasOne(d => d.Event)
                    .WithMany(p => p.TraEventUser)
                    .HasForeignKey(d => d.EventId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_EVENT_EVENT_USERS");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.TraEventUser)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_EVENT_USER_USER");
            });

            modelBuilder.Entity<TraMemberReq>(entity =>
            {
                entity.HasKey(e => e.MemberReqId);

                entity.ToTable("TRA_MEMBER_REQ");

                entity.HasIndex(e => e.TeamId)
                    .HasName("IX_FK_MEMBER_REQTEAM");

                entity.HasIndex(e => e.UserId)
                    .HasName("IX_FK_USER_MEMBER_REQ");

                entity.Property(e => e.MemberReqId).HasColumnName("MEMBER_REQ_ID");

                entity.Property(e => e.CreatedByDate)
                    .HasColumnName("CREATED_BY_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.CreatedByUser)
                    .HasColumnName("CREATED_BY_USER")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.EffectiveEndDate)
                    .HasColumnName("EFFECTIVE_END_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.EffectiveStartDate)
                    .HasColumnName("EFFECTIVE_START_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.LastUpdatedByDate)
                    .HasColumnName("LAST_UPDATED_BY_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.LastUpdatedByUser)
                    .HasColumnName("LAST_UPDATED_BY_USER")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.TeamId).HasColumnName("TEAM_ID");

                entity.Property(e => e.UserId).HasColumnName("USER_ID");

                entity.HasOne(d => d.Team)
                    .WithMany(p => p.TraMemberReq)
                    .HasForeignKey(d => d.TeamId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_MEMBER_REQTEAM");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.TraMemberReq)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_USER_MEMBER_REQ");
            });

            modelBuilder.Entity<TraRole>(entity =>
            {
                entity.HasKey(e => e.RoleId);

                entity.ToTable("TRA_ROLE");

                entity.Property(e => e.RoleId).HasColumnName("ROLE_ID");

                entity.Property(e => e.CreatedByDate)
                    .HasColumnName("CREATED_BY_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.CreatedByUser)
                    .HasColumnName("CREATED_BY_USER")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasColumnName("DESCRIPTION")
                    .HasMaxLength(1024)
                    .IsUnicode(false);

                entity.Property(e => e.EffectiveEndDate)
                    .HasColumnName("EFFECTIVE_END_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.EffectiveStartDate)
                    .HasColumnName("EFFECTIVE_START_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.LastUpdatedByDate)
                    .HasColumnName("LAST_UPDATED_BY_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.LastUpdatedByUser)
                    .HasColumnName("LAST_UPDATED_BY_USER")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("NAME")
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<TraTeam>(entity =>
            {
                entity.HasKey(e => e.TeamId)
                    .HasName("PK_TEAM");

                entity.ToTable("TRA_TEAM");

                entity.Property(e => e.TeamId).HasColumnName("TEAM_ID");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.DbCreateTimestamp)
                    .HasColumnName("DB_CREATE_TIMESTAMP")
                    .HasColumnType("datetime");

                entity.Property(e => e.DbCreateUserid)
                    .IsRequired()
                    .HasColumnName("DB_CREATE_USERID")
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.DbLastUpdateTimestamp)
                    .HasColumnName("DB_LAST_UPDATE_TIMESTAMP")
                    .HasColumnType("datetime");

                entity.Property(e => e.DbLastUpdateUserid)
                    .IsRequired()
                    .HasColumnName("DB_LAST_UPDATE_USERID")
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasColumnName("DESCRIPTION")
                    .HasColumnType("text");


                entity.Property(e => e.Goal).HasColumnName("GOAL");

                entity.Property(e => e.Region)
                    .IsRequired()
                    .HasColumnName("REGION")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                /*ADDED MANUALLY*/
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("NAME")
                    .HasMaxLength(1024)
                    .IsUnicode(false);

                entity.Property(e => e.UserId).HasColumnName("USER_ID");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.TraTeam)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_TEAM_USER");
            });

            modelBuilder.Entity<TraTopic>(entity =>
            {
                entity.HasKey(e => e.TopicId);

                entity.ToTable("TRA_TOPIC");

                entity.Property(e => e.TopicId).HasColumnName("TOPIC_ID");

                entity.Property(e => e.CreatedByDate)
                    .HasColumnName("CREATED_BY_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.CreatedByUser)
                    .HasColumnName("CREATED_BY_USER")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.EffectiveEndDate)
                    .HasColumnName("EFFECTIVE_END_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.EffectiveStartDate)
                    .HasColumnName("EFFECTIVE_START_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.LastUpdatedByDate)
                    .HasColumnName("LAST_UPDATED_BY_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.LastUpdatedByUser)
                    .HasColumnName("LAST_UPDATED_BY_USER")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasColumnName("TITLE")
                    .HasMaxLength(1024)
                    .IsUnicode(false);

                entity.Property(e => e.UserId).HasColumnName("USER_ID");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.TraTopic)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_USER_THREAD");
            });

            modelBuilder.Entity<TraTopicMessage>(entity =>
            {
                entity.HasKey(e => e.TopicMessageId);

                entity.ToTable("TRA_TOPIC_MESSAGE");

                entity.HasIndex(e => e.TopicId)
                    .HasName("IX_FK_MESSAGE_THREAD");

                entity.HasIndex(e => e.UserId)
                    .HasName("IX_FK_USER_THREAD");

                entity.Property(e => e.TopicMessageId).HasColumnName("TOPIC_MESSAGE_ID");

                entity.Property(e => e.Body)
                    .IsRequired()
                    .HasColumnName("BODY")
                    .HasColumnType("text");

                entity.Property(e => e.CreatedByDate)
                    .HasColumnName("CREATED_BY_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.CreatedByUser)
                    .HasColumnName("CREATED_BY_USER")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.EffectiveEndDate)
                    .HasColumnName("EFFECTIVE_END_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.EffectiveStartDate)
                    .HasColumnName("EFFECTIVE_START_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.LastUpdatedByDate)
                    .HasColumnName("LAST_UPDATED_BY_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.LastUpdatedByUser)
                    .HasColumnName("LAST_UPDATED_BY_USER")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.TopicId).HasColumnName("TOPIC_ID");

                entity.Property(e => e.UserId).HasColumnName("USER_ID");

                entity.HasOne(d => d.Topic)
                    .WithMany(p => p.TraTopicMessage)
                    .HasForeignKey(d => d.TopicId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_MESSAGE_TOPIC");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.TraTopicMessage)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_USER");
            });

            modelBuilder.Entity<TraUser>(entity =>
            {
                entity.HasKey(e => e.UserId)
                   .HasName("PK_USER");

                entity.ToTable("TRA_USER");

                entity.HasIndex(e => e.RoleId)
                    .HasName("IX_FK_USER_ROLE");

                entity.HasIndex(e => e.TeamId)
                    .HasName("IX_FK_USER_TEAM");

                entity.Property(e => e.UserId).HasColumnName("USER_ID");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.DbCreateTimestamp)
                    .HasColumnName("DB_CREATE_TIMESTAMP")
                    .HasColumnType("datetime");

                entity.Property(e => e.DbCreateUserid)
                    .IsRequired()
                    .HasColumnName("DB_CREATE_USERID")
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.DbLastUpdateTimestamp)
                    .HasColumnName("DB_LAST_UPDATE_TIMESTAMP")
                    .HasColumnType("datetime");

                entity.Property(e => e.DbLastUpdateUserid)
                    .IsRequired()
                    .HasColumnName("DB_LAST_UPDATE_USERID")
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasColumnName("DESCRIPTION")
                    .HasMaxLength(1024)
                    .IsUnicode(false);

                entity.Property(e => e.Directory)
                    .IsRequired()
                    .HasColumnName("DIRECTORY ")
                    .HasMaxLength(8)
                    .IsUnicode(false);

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasColumnName("EMAIL")
                    .HasMaxLength(1024)
                    .IsUnicode(false);

                entity.Property(e => e.Fname)
                    .IsRequired()
                    .HasColumnName("FNAME")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Guid)
                    .IsRequired()
                    .HasColumnName("GUID")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Lname)
                    .IsRequired()
                    .HasColumnName("LNAME")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Region)
                    .IsRequired()
                    .HasColumnName("REGION")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.RoleId).HasColumnName("ROLE_ID");

                entity.Property(e => e.TeamId).HasColumnName("TEAM_ID");

                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasColumnName("USERNAME")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.TraUser)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_USER_ROLE");

                entity.HasOne(d => d.Team)
                    .WithMany(p => p.TraUser)
                    .HasForeignKey(d => d.TeamId)
                    .HasConstraintName("FK_USER_TEAM");
            });

            modelBuilder.Entity<TraUserActivity>(entity =>
            {
                entity.HasKey(e => e.UserActivityId);

                entity.ToTable("TRA_USER_ACTIVITY");

                entity.HasIndex(e => e.ActivityId)
                    .HasName("IX_FK_ACTIVITY_USER_ACTIVITY");

                entity.HasIndex(e => e.UserId)
                    .HasName("IX_FK_USER_ACTIVITY_USER");

                entity.Property(e => e.UserActivityId).HasColumnName("USER_ACTIVITY_ID");

                entity.Property(e => e.ActivityId).HasColumnName("ACTIVITY_ID");

                entity.Property(e => e.CreatedByDate)
                    .HasColumnName("CREATED_BY_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.CreatedByUser)
                    .HasColumnName("CREATED_BY_USER")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasColumnName("DESCRIPTION")
                    .HasColumnType("text");

                entity.Property(e => e.EffectiveEndDate)
                    .HasColumnName("EFFECTIVE_END_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.EffectiveStartDate)
                    .HasColumnName("EFFECTIVE_START_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.Hours).HasColumnName("HOURS");

                entity.Property(e => e.LastUpdatedByDate)
                    .HasColumnName("LAST_UPDATED_BY_DATE")
                    .HasColumnType("datetime");

                entity.Property(e => e.LastUpdatedByUser)
                    .HasColumnName("LAST_UPDATED_BY_USER")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.UserId).HasColumnName("USER_ID");

                entity.HasOne(d => d.Activity)
                    .WithMany(p => p.TraUserActivity)
                    .HasForeignKey(d => d.ActivityId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ACTIVITY_USER_ACTIVITY");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.TraUserActivity)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_USER_ACTIVITY_USER");
            });
        }
    }
}
