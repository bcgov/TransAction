﻿CREATE TABLE [dbo].[TRA_USER_ACTIVITY]
(
    [USER_ACTIVITY_ID] INT IDENTITY (1, 1) NOT NULL,
	[NAME] VARCHAR(1024) NOT NULL,
    [DESCRIPTION] TEXT NOT NULL,
    [HOURS] FLOAT NOT NULL,
    [USER_ID] INT NOT NULL,
    [ACTIVITY_ID] INT NOT NULL,
	[TEAM_ID] INT NOT NULL, -- CANNOT BE NULL BECAUSE NO USER ACTIVITY WITHOUT A TEAM (CHECK TRIGGERS TOO)
	[EVENT_ID] INT NOT NULL, -- JUST ADDED THIS AS WELL
    [DB_CREATE_TIMESTAMP] DATETIME NOT NULL,
    [DB_CREATE_USERID] VARCHAR(30) NOT NULL,
    [DB_LAST_UPDATE_TIMESTAMP] DATETIME NOT NULL,
    [DB_LAST_UPDATE_USERID] VARCHAR(30) NOT NULL,
    [CONCURRENCY_CONTROL_NUMBER] BIGINT NOT NULL DEFAULT 1    , 
    CONSTRAINT [PK_USER_ACTIVITY] PRIMARY KEY CLUSTERED ([USER_ACTIVITY_ID] ASC),
    CONSTRAINT [FK_USER_ACTIVITY_ACTIVITY] FOREIGN KEY ([ACTIVITY_ID]) REFERENCES [dbo].[TRA_ACTIVITY] ([ACTIVITY_ID]),
    CONSTRAINT [FK_USER_ACTIVITY_USER] FOREIGN KEY ([USER_ID]) REFERENCES [dbo].[TRA_USER] ([USER_ID]),
	CONSTRAINT [FK_USER_ACTIVITY_TEAM] FOREIGN KEY ([TEAM_ID]) REFERENCES [dbo].[TRA_TEAM] ([TEAM_ID]),
	CONSTRAINT [FK_USER_ACTIVITY_EVENT] FOREIGN KEY ([EVENT_ID]) REFERENCES [dbo].[TRA_EVENT] ([EVENT_ID])
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
    @value = N'The user or proxy account that created the record. ',
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
    @value = N'The user or proxy account that created or last updated the record. ',
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

	GO
CREATE TRIGGER [dbo].[TRA_USER_ACTIVITY_IS_U_TR] 
   ON  [dbo].[TRA_USER_ACTIVITY]
   INSTEAD OF UPDATE
AS 
BEGIN
	SET NOCOUNT ON;

	DECLARE @TEAM_CONC INT;
	SET @TEAM_CONC = (SELECT CONCURRENCY_CONTROL_NUMBER FROM TRA_USER_ACTIVITY WHERE TRA_USER_ACTIVITY.USER_ACTIVITY_ID = (SELECT USER_ACTIVITY_ID FROM inserted));
	DECLARE @INSERTED_CONC INT;
	SET @INSERTED_CONC = (SELECT CONCURRENCY_CONTROL_NUMBER FROM inserted);

	IF((@INSERTED_CONC) - (@TEAM_CONC) != 1)	 
	BEGIN
	RAISERROR('Concurrency Failure',16,10068);
	RETURN
	END
	
	ELSE
	BEGIN 	
	UPDATE TRA_USER_ACTIVITY
	SET
	TRA_USER_ACTIVITY.DESCRIPTION = inserted.DESCRIPTION,
	TRA_USER_ACTIVITY.NAME = inserted.NAME,
	TRA_USER_ACTIVITY.HOURS = inserted.HOURS,
	TRA_USER_ACTIVITY.USER_ID = inserted.USER_ID,
	TRA_USER_ACTIVITY.TEAM_ID = inserted.TEAM_ID,
	TRA_USER_ACTIVITY.EVENT_ID = inserted.EVENT_ID,
	TRA_USER_ACTIVITY.ACTIVITY_ID = inserted.ACTIVITY_ID,
	TRA_USER_ACTIVITY.DB_CREATE_TIMESTAMP =	inserted.DB_CREATE_TIMESTAMP,
	TRA_USER_ACTIVITY.DB_CREATE_USERID = inserted.DB_CREATE_USERID,
	TRA_USER_ACTIVITY.DB_LAST_UPDATE_TIMESTAMP = CURRENT_TIMESTAMP,
	TRA_USER_ACTIVITY.DB_LAST_UPDATE_USERID = CURRENT_USER,
	TRA_USER_ACTIVITY.CONCURRENCY_CONTROL_NUMBER = inserted.CONCURRENCY_CONTROL_NUMBER
	FROM TRA_USER_ACTIVITY 
	INNER JOIN  inserted 
	ON TRA_USER_ACTIVITY.USER_ACTIVITY_ID = inserted.USER_ACTIVITY_ID;	
	END

END

GO
CREATE TRIGGER [dbo].[TRA_USER_ACTIVITY_IS_I_TR] 
   ON  [dbo].[TRA_USER_ACTIVITY]
   INSTEAD OF INSERT
AS 
BEGIN
	
	SET NOCOUNT ON;
	BEGIN
	INSERT INTO TRA_USER_ACTIVITY(
	   [DESCRIPTION]
      ,[NAME]
	  ,[HOURS]	  
      ,[USER_ID]
      ,[ACTIVITY_ID]
	  ,[EVENT_ID]
	  ,[TEAM_ID]
      ,[DB_CREATE_TIMESTAMP]
      ,[DB_CREATE_USERID]
      ,[DB_LAST_UPDATE_TIMESTAMP]
      ,[DB_LAST_UPDATE_USERID]
      ,[CONCURRENCY_CONTROL_NUMBER])
	
	SELECT 
	   [DESCRIPTION]	
	  ,[NAME] 
      ,[HOURS]	  
      ,[USER_ID]
      ,[ACTIVITY_ID]
	  ,[EVENT_ID]
	  ,[TEAM_ID]
      ,CURRENT_TIMESTAMP
      ,CURRENT_USER
      ,CURRENT_TIMESTAMP
      ,CURRENT_USER
      ,1
	FROM inserted
	END

	
	SELECT USER_ACTIVITY_ID FROM dbo.TRA_USER_ACTIVITY WHERE @@ROWCOUNT > 0 AND USER_ACTIVITY_ID = SCOPE_IDENTITY() 

END;