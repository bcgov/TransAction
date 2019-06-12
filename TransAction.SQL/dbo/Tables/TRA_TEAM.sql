CREATE TABLE [dbo].[TRA_TEAM]
(
    [TEAM_ID] INT IDENTITY (1, 1) NOT NULL,
    [NAME] VARCHAR(255) NOT NULL,
	[REGION_ID] INT NOT NULL, 
    [DESCRIPTION] TEXT NOT NULL,
    [GOAL] INT NOT NULL,
    [USER_ID] INT NOT NULL,
    [DB_CREATE_TIMESTAMP] DATETIME NOT NULL,
    [DB_CREATE_USERID] VARCHAR(30) NOT NULL,
    [DB_LAST_UPDATE_TIMESTAMP] DATETIME NOT NULL,
    [DB_LAST_UPDATE_USERID] VARCHAR(30) NOT NULL,
    [CONCURRENCY_CONTROL_NUMBER] BIGINT NOT NULL DEFAULT 1,    
    CONSTRAINT [PK_TEAM] PRIMARY KEY CLUSTERED ([TEAM_ID] ASC),
    CONSTRAINT [FK_TEAM_USER] FOREIGN KEY ([USER_ID]) REFERENCES [TRA_USER]([USER_ID]),
	CONSTRAINT [FK_TEAM_REGION] FOREIGN KEY ([REGION_ID]) REFERENCES [TRA_REGION]([REGION_ID])
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
    @value = N'The user or proxy account that created the record. ',
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
    @value = N'The user or proxy account that created or last updated the record. ',
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
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Keeps track of the team infromation',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_TEAM',
    @level2type = NULL,
    @level2name = NULL

GO
CREATE TRIGGER [dbo].[TRA_TEAM_IS_U_TR] 
   ON  [dbo].[TRA_TEAM]
   INSTEAD OF UPDATE
AS 
BEGIN
	SET NOCOUNT ON;

	DECLARE @TEAM_CONC INT;
	SET @TEAM_CONC = (SELECT CONCURRENCY_CONTROL_NUMBER FROM TRA_TEAM WHERE TRA_TEAM.TEAM_ID = (SELECT TEAM_ID FROM inserted));
	DECLARE @INSERTED_CONC INT;
	SET @INSERTED_CONC = (SELECT CONCURRENCY_CONTROL_NUMBER FROM inserted);

	IF((@INSERTED_CONC) - (@TEAM_CONC) != 1)	 
	BEGIN
	RAISERROR('Concurrency Failure',16,10068);
	RETURN
	END
	
	ELSE
	BEGIN 	
	UPDATE TRA_TEAM
	SET
	TRA_TEAM.NAME = inserted.NAME,
	TRA_TEAM.REGION_ID = inserted.REGION_ID,
	TRA_TEAM.DESCRIPTION = inserted.DESCRIPTION,
	TRA_TEAM.USER_ID = inserted.USER_ID,
	TRA_TEAM.GOAL = inserted.GOAL,
	TRA_TEAM.DB_CREATE_TIMESTAMP =	inserted.DB_CREATE_TIMESTAMP,
	TRA_TEAM.DB_CREATE_USERID = inserted.DB_CREATE_USERID,
	TRA_TEAM.DB_LAST_UPDATE_TIMESTAMP = CURRENT_TIMESTAMP,
	TRA_TEAM.DB_LAST_UPDATE_USERID = CURRENT_USER,
	TRA_TEAM.CONCURRENCY_CONTROL_NUMBER = inserted.CONCURRENCY_CONTROL_NUMBER
	FROM TRA_TEAM 
	INNER JOIN  inserted 
	ON TRA_TEAM.TEAM_ID = inserted.TEAM_ID;	
	END

END
GO

CREATE TRIGGER [dbo].[TRA_TEAM_AS_I_TR] 
	ON  [dbo].[TRA_TEAM]
	AFTER INSERT
AS 
BEGIN
	
	SET NOCOUNT ON;

	UPDATE TRA_TEAM
	SET [DB_CREATE_TIMESTAMP] = CURRENT_TIMESTAMP
      ,[DB_CREATE_USERID] = CURRENT_USER
      ,[DB_LAST_UPDATE_TIMESTAMP] = CURRENT_TIMESTAMP
      ,[DB_LAST_UPDATE_USERID] = CURRENT_USER
      ,[CONCURRENCY_CONTROL_NUMBER] = 1

	FROM inserted
	WHERE TRA_TEAM.TEAM_ID = inserted.TEAM_ID

END