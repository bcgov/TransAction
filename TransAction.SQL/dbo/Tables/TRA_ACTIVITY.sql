CREATE TABLE [dbo].[TRA_ACTIVITY] (
    [ACTIVITY_ID]        INT            IDENTITY (1, 1) NOT NULL,
    [NAME]      VARCHAR(1024) NOT NULL,
	[DESCRIPTION] VARCHAR(255) NULL,
    [INTENSITY] INT NOT NULL,
	[DB_CREATE_TIMESTAMP] DATETIME NOT NULL, 
	[DB_CREATE_USERID] VARCHAR(30) NOT NULL, 
	[DB_LAST_UPDATE_TIMESTAMP] DATETIME NOT NULL, 
	[DB_LAST_UPDATE_USERID] VARCHAR(30) NOT NULL,
     
    [CONCURRENCY_CONTROL_NUMBER] BIGINT NOT NULL DEFAULT 1, 
    CONSTRAINT [PK_ACTIVITY] PRIMARY KEY CLUSTERED ([ACTIVITY_ID] ASC)
);


GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_ACTIVITY',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created the record. **',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_ACTIVITY',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_USERID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created or last updated.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_ACTIVITY',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created or last updated the record. **',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_ACTIVITY',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_USERID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Name of the activity',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_ACTIVITY',
    @level2type = N'COLUMN',
    @level2name = N'NAME'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Description of the activity if the user selects "Other" option',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_ACTIVITY',
    @level2type = N'COLUMN',
    @level2name = N'DESCRIPTION'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Keeps track of all the activites',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_ACTIVITY',
    @level2type = NULL,
    @level2name = NULL