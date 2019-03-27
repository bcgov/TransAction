CREATE TABLE [dbo].[TRA_USER] (
    [USER_ID]               INT            IDENTITY (1, 1) NOT NULL,
    [USERNAME]             VARCHAR(255) NOT NULL,
    [DIRECTORY ] VARCHAR(8) NOT NULL,
	[GUID] VARCHAR(255) NOT NULL,
    [REGION]           VARCHAR(255) NOT NULL,
    [FNAME]            VARCHAR(255) NOT NULL,
    [LNAME]            VARCHAR(255) NOT NULL,
    [DESCRIPTION]      VARCHAR(1024) NOT NULL,
    [EMAIL]            VARCHAR(1024) NOT NULL,
    [ROLE_ID]      INT            NOT NULL,
    [TEAM_ID]       INT,
	[DB_CREATE_TIMESTAMP] DATETIME NOT NULL, 
	[DB_CREATE_USERID] VARCHAR(30) NOT NULL, 
	[DB_LAST_UPDATE_TIMESTAMP] DATETIME NOT NULL, 
	[DB_LAST_UPDATE_USERID] VARCHAR(30) NOT NULL,
     
     
    [CONCURRENCY_CONTROL_NUMBER] BIGINT NOT NULL DEFAULT 1, 
    CONSTRAINT [PK_USER] PRIMARY KEY CLUSTERED ([USER_ID] ASC),
    CONSTRAINT [FK_USER_ROLE] FOREIGN KEY ([ROLE_ID]) REFERENCES [dbo].[TRA_ROLE] ([ROLE_ID]),
    CONSTRAINT [FK_USER_TEAM] FOREIGN KEY ([TEAM_ID]) REFERENCES [dbo].[TRA_TEAM] ([TEAM_ID])
);


GO
CREATE NONCLUSTERED INDEX [IX_FK_USER_ROLE]
    ON [dbo].[TRA_USER]([ROLE_ID] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_FK_USER_TEAM]
    ON [dbo].[TRA_USER]([TEAM_ID] ASC);




GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_USER',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created the record. **',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_USER',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_USERID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created or last updated.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_USER',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created or last updated the record. **',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_USER',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_USERID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Keeps track and contains all the information about the user',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_USER',
    @level2type = NULL,
    @level2name = NULL