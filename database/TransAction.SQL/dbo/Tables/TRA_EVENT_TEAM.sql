﻿CREATE TABLE [dbo].[TRA_EVENT_TEAM]
(
    [EVENT_TEAM_ID] INT IDENTITY (1, 1) NOT NULL,
    [EVENT_ID] INT NOT NULL,
    [TEAM_ID] INT NOT NULL,
    [DB_CREATE_TIMESTAMP] DATETIME NOT NULL,
    [DB_CREATE_USERID] VARCHAR(30) NOT NULL,
    [DB_LAST_UPDATE_TIMESTAMP] DATETIME NOT NULL,
    [DB_LAST_UPDATE_USERID] VARCHAR(30) NOT NULL,
    [CONCURRENCY_CONTROL_NUMBER] BIGINT NOT NULL DEFAULT 1,
    CONSTRAINT [PK_EVENT_TEAM] PRIMARY KEY CLUSTERED ([EVENT_TEAM_ID] ASC),
    CONSTRAINT [FK_EVENT_TEAM_EVENT] FOREIGN KEY ([EVENT_ID]) REFERENCES [dbo].[TRA_EVENT] ([EVENT_ID]),
    CONSTRAINT [FK_EVENT_TEAM_TEAM] FOREIGN KEY ([TEAM_ID]) REFERENCES [dbo].[TRA_TEAM] ([TEAM_ID])
);


GO
CREATE NONCLUSTERED INDEX [IX_FK_EVENT_TEAM_EVENT]
    ON [dbo].[TRA_EVENT_TEAM]([EVENT_ID] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_FK_EVENT_TEAM_TEAM]
    ON [dbo].[TRA_EVENT_TEAM]([TEAM_ID] ASC);


GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_EVENT_TEAM',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created the record.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_EVENT_TEAM',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_USERID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created or last updated.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_EVENT_TEAM',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created or last updated the record. ',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_EVENT_TEAM',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_USERID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Keeps track of all the events and the teams  that participated in it',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_EVENT_TEAM',
    @level2type = NULL,
    @level2name = NULL
GO
CREATE TRIGGER [dbo].[TRA_EVENT_TEAM_IS_U_TR] 
	 ON  [dbo].[TRA_EVENT_TEAM]
	 INSTEAD OF UPDATE
AS 
BEGIN
	SET NOCOUNT ON;

	DECLARE @FAIL_COUNT INT;
	SET @FAIL_COUNT = (
		SELECT COUNT(*) 
		FROM TRA_EVENT_TEAM

		JOIN inserted 
		ON TRA_EVENT_TEAM.EVENT_TEAM_ID = inserted.EVENT_TEAM_ID

		WHERE TRA_EVENT_TEAM.CONCURRENCY_CONTROL_NUMBER + 1 != inserted.CONCURRENCY_CONTROL_NUMBER
	)


	IF(@FAIL_COUNT != 0)	 
		BEGIN
		RAISERROR('Concurrency Failure',16,10068);
		RETURN
	END
	
	ELSE
	BEGIN 	
	UPDATE TRA_EVENT_TEAM
	SET
	TRA_EVENT_TEAM.EVENT_ID = inserted.EVENT_ID,
	TRA_EVENT_TEAM.TEAM_ID = inserted.TEAM_ID,
	TRA_EVENT_TEAM.DB_CREATE_TIMESTAMP =	inserted.DB_CREATE_TIMESTAMP,
	TRA_EVENT_TEAM.DB_CREATE_USERID = inserted.DB_CREATE_USERID,
	TRA_EVENT_TEAM.DB_LAST_UPDATE_TIMESTAMP = CURRENT_TIMESTAMP,
	TRA_EVENT_TEAM.DB_LAST_UPDATE_USERID = CURRENT_USER,
	TRA_EVENT_TEAM.CONCURRENCY_CONTROL_NUMBER = inserted.CONCURRENCY_CONTROL_NUMBER
	FROM TRA_EVENT_TEAM 
	INNER JOIN  inserted 
	ON TRA_EVENT_TEAM.EVENT_TEAM_ID = inserted.EVENT_TEAM_ID;	
	END

END

GO
CREATE TRIGGER [dbo].[TRA_EVENT_TEAM_AS_I_TR] 
   ON  [dbo].[TRA_EVENT_TEAM]
   AFTER INSERT
AS 
BEGIN
	
	SET NOCOUNT ON;

	UPDATE TRA_EVENT_TEAM
	SET [DB_CREATE_TIMESTAMP] = CURRENT_TIMESTAMP
      ,[DB_CREATE_USERID] = CURRENT_USER
      ,[DB_LAST_UPDATE_TIMESTAMP] = CURRENT_TIMESTAMP
      ,[DB_LAST_UPDATE_USERID] = CURRENT_USER
      ,[CONCURRENCY_CONTROL_NUMBER] = 1

	FROM inserted
	WHERE TRA_EVENT_TEAM.EVENT_TEAM_ID = inserted.EVENT_TEAM_ID

END
