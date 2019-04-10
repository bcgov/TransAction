CREATE TABLE [dbo].[TRA_ACTIVITY]
(
    [ACTIVITY_ID] INT IDENTITY (1, 1) NOT NULL,
    [NAME] VARCHAR(1024) NOT NULL,
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
GO
CREATE TRIGGER [dbo].[TRA_ACTIVITY_IS_U_TR] 
   ON  [dbo].[TRA_ACTIVITY]
   INSTEAD OF UPDATE
AS 
BEGIN
	SET NOCOUNT ON;

	DECLARE @TEAM_CONC INT;
	SET @TEAM_CONC = (SELECT CONCURRENCY_CONTROL_NUMBER FROM TRA_ACTIVITY WHERE TRA_ACTIVITY.ACTIVITY_ID = (SELECT ACTIVITY_ID FROM inserted));
	DECLARE @INSERTED_CONC INT;
	SET @INSERTED_CONC = (SELECT CONCURRENCY_CONTROL_NUMBER FROM inserted);

	IF((@INSERTED_CONC) - (@TEAM_CONC) != 1)	 
	BEGIN
	RAISERROR('Concurrency Failure',16,10068);
	RETURN
	END
	
	ELSE
	BEGIN 	
	UPDATE TRA_ACTIVITY
	SET
	TRA_ACTIVITY.NAME = inserted.NAME,
	TRA_ACTIVITY.DESCRIPTION = inserted.DESCRIPTION,
	TRA_ACTIVITY.INTENSITY = inserted.INTENSITY,
	TRA_ACTIVITY.DB_CREATE_TIMESTAMP =	inserted.DB_CREATE_TIMESTAMP,
	TRA_ACTIVITY.DB_CREATE_USERID = inserted.DB_CREATE_USERID,
	TRA_ACTIVITY.DB_LAST_UPDATE_TIMESTAMP = CURRENT_TIMESTAMP,
	TRA_ACTIVITY.DB_LAST_UPDATE_USERID = CURRENT_USER,
	TRA_ACTIVITY.CONCURRENCY_CONTROL_NUMBER = inserted.CONCURRENCY_CONTROL_NUMBER 
	FROM TRA_ACTIVITY 
	INNER JOIN  inserted 
	ON TRA_ACTIVITY.ACTIVITY_ID = inserted.ACTIVITY_ID;	
	END

END

GO 
CREATE TRIGGER [dbo].[TRA_ACTIVITY_IS_I_TR] 
   ON  [dbo].[TRA_ACTIVITY]
   INSTEAD OF INSERT
AS 
BEGIN
	
	SET NOCOUNT ON;
	BEGIN
	INSERT INTO TRA_ACTIVITY(
	   [NAME]
      ,[DESCRIPTION]
      ,[INTENSITY]
      ,[DB_CREATE_TIMESTAMP]
      ,[DB_CREATE_USERID]
      ,[DB_LAST_UPDATE_TIMESTAMP]
      ,[DB_LAST_UPDATE_USERID]
      ,[CONCURRENCY_CONTROL_NUMBER])
	
	SELECT 
	   [NAME]
      ,[DESCRIPTION]
      ,[INTENSITY]
      ,CURRENT_TIMESTAMP
      ,CURRENT_USER
      ,CURRENT_TIMESTAMP
      ,CURRENT_USER
      ,1
	FROM inserted
	END

	
	SELECT ACTIVITY_ID FROM dbo.TRA_ACTIVITY WHERE @@ROWCOUNT > 0 AND ACTIVITY_ID = SCOPE_IDENTITY() 

END;