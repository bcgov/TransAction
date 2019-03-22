CREATE TABLE [dbo].[TRA_TEAM] (
    [TEAM_ID]           INT            IDENTITY (1, 1) NOT NULL,
    [REGION]       VARCHAR(255) NOT NULL,
    [DESCRIPTION]   TEXT NOT NULL,
    [GOAL] INT NOT NULL,
    [USER_ID]   INT NOT NULL,
	[DB_CREATE_TIMESTAMP] DATETIME NOT NULL, 
	[DB_CREATE_USERID] VARCHAR(30) NOT NULL, 
	[DB_LAST_UPDATE_TIMESTAMP] DATETIME NOT NULL, 
	[DB_LAST_UPDATE_USERID] VARCHAR(30) NOT NULL,
    [CONCURRENCY_CONTROL_NUMBER] BIGINT NOT NULL DEFAULT 1, 
    CONSTRAINT [PK_TEAM] PRIMARY KEY CLUSTERED ([TEAM_ID] ASC), 
    CONSTRAINT [FK_TEAM_USER] FOREIGN KEY ([USER_ID]) REFERENCES [TRA_USER]([USER_ID])
);


GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_TEAM',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created the record. **',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_TEAM',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_USERID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created or last updated.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_TEAM',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created or last updated the record. **',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_TEAM',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_USERID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'This is the goal team leader sets for the whole team',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_TEAM',
    @level2type = N'COLUMN',
    @level2name = N'GOAL'