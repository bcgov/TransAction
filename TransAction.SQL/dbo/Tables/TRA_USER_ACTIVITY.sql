CREATE TABLE [dbo].[TRA_USER_ACTIVITY]
(
    [USER_ACTIVITY_ID] INT IDENTITY (1, 1) NOT NULL,
    [DESCRIPTION] TEXT NOT NULL,
    [HOURS] FLOAT NOT NULL,
    [USER_ID] INT NOT NULL,
    [ACTIVITY_ID] INT NOT NULL,
    [DB_CREATE_TIMESTAMP] DATETIME NOT NULL,
    [DB_CREATE_USERID] VARCHAR(30) NOT NULL,
    [DB_LAST_UPDATE_TIMESTAMP] DATETIME NOT NULL,
    [DB_LAST_UPDATE_USERID] VARCHAR(30) NOT NULL,
    [CONCURRENCY_CONTROL_NUMBER] BIGINT NOT NULL DEFAULT 1,
    CONSTRAINT [PK_USER_ACTIVITY] PRIMARY KEY CLUSTERED ([USER_ACTIVITY_ID] ASC),
    CONSTRAINT [FK_USER_ACTIVITY_ACTIVITY] FOREIGN KEY ([ACTIVITY_ID]) REFERENCES [dbo].[TRA_ACTIVITY] ([ACTIVITY_ID]),
    CONSTRAINT [FK_USER_ACTIVITY_USER] FOREIGN KEY ([USER_ID]) REFERENCES [dbo].[TRA_USER] ([USER_ID])
);


GO
CREATE NONCLUSTERED INDEX [IX_FK_USER_ACTIVITY_USER]
    ON [dbo].[TRA_USER_ACTIVITY]([USER_ID] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_FK_USER_ACTIVITY_ACTIVITY]
    ON [dbo].[TRA_USER_ACTIVITY]([ACTIVITY_ID] ASC);


GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_USER_ACTIVITY',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created the record. **',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_USER_ACTIVITY',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_USERID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created or last updated.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_USER_ACTIVITY',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created or last updated the record. **',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_USER_ACTIVITY',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_USERID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Keeps track of all the user activity',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_USER_ACTIVITY',
    @level2type = NULL,
    @level2name = NULL