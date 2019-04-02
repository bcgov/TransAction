CREATE TABLE [dbo].[TRA_EVENT_USER] (
    [EVENT_USER_ID]       INT IDENTITY (1, 1) NOT NULL,
    [EVENT_ID] INT NOT NULL,
    [USER_ID]  INT NOT NULL,
	[DB_CREATE_TIMESTAMP] DATETIME NOT NULL, 
	[DB_CREATE_USERID] VARCHAR(30) NOT NULL, 
	[DB_LAST_UPDATE_TIMESTAMP] DATETIME NOT NULL, 
	[DB_LAST_UPDATE_USERID] VARCHAR(30) NOT NULL,
    CONSTRAINT [PK_EVENT_USER] PRIMARY KEY CLUSTERED ([EVENT_USER_ID] ASC),
    CONSTRAINT [FK_EVENT_USER_EVENT] FOREIGN KEY ([EVENT_ID]) REFERENCES [dbo].[TRA_EVENT] ([EVENT_ID]),
    CONSTRAINT [FK_EVENT_USER_USER] FOREIGN KEY ([USER_ID]) REFERENCES [dbo].[TRA_USER] ([USER_ID])
);


GO
CREATE NONCLUSTERED INDEX [IX_FK_EVENT_USER_EVENT]
    ON [dbo].[TRA_EVENT_USER]([EVENT_ID] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_FK_EVENT_USER_USER]
    ON [dbo].[TRA_EVENT_USER]([USER_ID] ASC);


GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_EVENT_USER',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created the record. **',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_EVENT_USER',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_USERID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created or last updated.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_EVENT_USER',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created or last updated the record. **',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_EVENT_USER',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_USERID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Keeps track of all the events and the users that participated in it',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_EVENT_USER',
    @level2type = NULL,
    @level2name = NULL