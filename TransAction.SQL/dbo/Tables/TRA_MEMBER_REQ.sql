CREATE TABLE [dbo].[TRA_MEMBER_REQ]
(
    [MEMBER_REQ_ID] INT IDENTITY (1, 1) NOT NULL,
    [USER_ID] INT NOT NULL,
    [TEAM_ID] INT NOT NULL,
    [DB_CREATE_TIMESTAMP] DATETIME NOT NULL,
    [DB_CREATE_USERID] VARCHAR(30) NOT NULL,
    [DB_LAST_UPDATE_TIMESTAMP] DATETIME NOT NULL,
    [DB_LAST_UPDATE_USERID] VARCHAR(30) NOT NULL,
    [CONCURRENCY_CONTROL_NUMBER] BIGINT NOT NULL DEFAULT 1,
    CONSTRAINT [PK_MEMBER_REQ] PRIMARY KEY CLUSTERED ([MEMBER_REQ_ID] ASC),
    CONSTRAINT [FK_MEMBER_REQ_TEAM] FOREIGN KEY ([TEAM_ID]) REFERENCES [dbo].[TRA_TEAM] ([TEAM_ID]),
    CONSTRAINT [FK_MEMBER_REQ_USER] FOREIGN KEY ([USER_ID]) REFERENCES [dbo].[TRA_USER] ([USER_ID])
);


GO
CREATE NONCLUSTERED INDEX [IX_FK_MEMBER_REQ_USER]
    ON [dbo].[TRA_MEMBER_REQ]([USER_ID] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_FK_MEMBER_REQ_TEAM]
    ON [dbo].[TRA_MEMBER_REQ]([TEAM_ID] ASC);


GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_MEMBER_REQ',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created the record. **',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_MEMBER_REQ',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_USERID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created or last updated.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_MEMBER_REQ',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created or last updated the record. **',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_MEMBER_REQ',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_USERID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Keeps track of the req sent by a user to a team',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_MEMBER_REQ',
    @level2type = NULL,
    @level2name = NULL