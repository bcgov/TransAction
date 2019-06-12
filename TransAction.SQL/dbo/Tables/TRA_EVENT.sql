CREATE TABLE [dbo].[TRA_EVENT]
(
    [EVENT_ID] INT IDENTITY (1, 1) NOT NULL,
    [START_DATE] DATETIME NOT NULL,
    [END_DATE] DATETIME NOT NULL,
    [NAME] VARCHAR(1024) NOT NULL,
    [DESCRIPTION] TEXT NOT NULL,
	[IS_ACTIVE] BIT NOT NULL DEFAULT 1, 
    [DB_CREATE_TIMESTAMP] DATETIME NOT NULL,
    [DB_CREATE_USERID] VARCHAR(30) NOT NULL,
    [DB_LAST_UPDATE_TIMESTAMP] DATETIME NOT NULL,
    [DB_LAST_UPDATE_USERID] VARCHAR(30) NOT NULL,
    [CONCURRENCY_CONTROL_NUMBER] BIGINT NOT NULL DEFAULT 1,    
    CONSTRAINT [PK_EVENT] PRIMARY KEY CLUSTERED ([EVENT_ID] ASC)
);


GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_EVENT',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created the record. ',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_EVENT',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_USERID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created or last updated.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_EVENT',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created or last updated the record. ',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_EVENT',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_USERID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Keeps track of the Events',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_EVENT',
    @level2type = NULL,
    @level2name = NULL


GO
CREATE TRIGGER [dbo].[TRA_EVENT_IS_U_TR] 
   ON  [dbo].[TRA_EVENT]
   INSTEAD OF UPDATE
AS 
BEGIN
	SET NOCOUNT ON;

	DECLARE @TEAM_CONC INT;
	SET @TEAM_CONC = (SELECT CONCURRENCY_CONTROL_NUMBER FROM TRA_EVENT WHERE TRA_EVENT.EVENT_ID = (SELECT EVENT_ID FROM inserted));
	DECLARE @INSERTED_CONC INT;
	SET @INSERTED_CONC = (SELECT CONCURRENCY_CONTROL_NUMBER FROM inserted);

	IF((@INSERTED_CONC) - (@TEAM_CONC) != 1)	 
	BEGIN
	RAISERROR('Concurrency Failure',16,10068);
	RETURN
	END
	
	ELSE
	BEGIN 	
	UPDATE TRA_EVENT
	SET
	TRA_EVENT.NAME = inserted.NAME,
	TRA_EVENT.START_DATE = inserted.START_DATE,
	TRA_EVENT.END_DATE = inserted.END_DATE,
	TRA_EVENT.DESCRIPTION = inserted.DESCRIPTION,
	TRA_EVENT.IS_ACTIVE = inserted.IS_ACTIVE,
	TRA_EVENT.DB_CREATE_TIMESTAMP =	inserted.DB_CREATE_TIMESTAMP,
	TRA_EVENT.DB_CREATE_USERID = inserted.DB_CREATE_USERID,
	TRA_EVENT.DB_LAST_UPDATE_TIMESTAMP = CURRENT_TIMESTAMP,
	TRA_EVENT.DB_LAST_UPDATE_USERID = CURRENT_USER,
	TRA_EVENT.CONCURRENCY_CONTROL_NUMBER = inserted.CONCURRENCY_CONTROL_NUMBER
	FROM TRA_EVENT 
	INNER JOIN  inserted 
	ON TRA_EVENT.EVENT_ID = inserted.EVENT_ID;	
	END

END

GO
CREATE TRIGGER [dbo].[TRA_EVENT_AS_I_TR] 
   ON  [dbo].[TRA_EVENT]
   AFTER INSERT
AS 
BEGIN
	
	SET NOCOUNT ON;

	UPDATE TRA_EVENT
	SET [DB_CREATE_TIMESTAMP] = CURRENT_TIMESTAMP
      ,[DB_CREATE_USERID] = CURRENT_USER
      ,[DB_LAST_UPDATE_TIMESTAMP] = CURRENT_TIMESTAMP
      ,[DB_LAST_UPDATE_USERID] = CURRENT_USER
      ,[CONCURRENCY_CONTROL_NUMBER] = 1

	FROM inserted
	WHERE TRA_EVENT.EVENT_ID = inserted.EVENT_ID

END

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Keeps track if the event is active (1 is active)',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_EVENT',
    @level2type = N'COLUMN',
    @level2name = N'IS_ACTIVE'
