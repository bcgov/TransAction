CREATE TABLE [dbo].[TRA_ROLE] (
    [ROLE_ID]     INT            IDENTITY (1, 1) NOT NULL,
    [NAME] VARCHAR(255)            NOT NULL,
    [DESCRIPTION]  VARCHAR(1024) NOT NULL,
	[DB_CREATE_TIMESTAMP] DATETIME NOT NULL, 
	[DB_CREATE_USERID] VARCHAR(30) NOT NULL, 
	[DB_LAST_UPDATE_TIMESTAMP] DATETIME NOT NULL, 
	[DB_LAST_UPDATE_USERID] VARCHAR(30) NOT NULL, 
    [CONCURRENCY_CONTROL_NUMBER] BIGINT NOT NULL DEFAULT 1, 
    CONSTRAINT [PK_ROLE] PRIMARY KEY CLUSTERED ([ROLE_ID] ASC)
);


GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_ROLE',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created the record. ',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_ROLE',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_USERID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created or last updated.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_ROLE',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created or last updated the record. ',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_ROLE',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_USERID'
GO

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Keeps track of the three roles',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_ROLE',
    @level2type = NULL,
    @level2name = NULL
	GO
CREATE TRIGGER [dbo].[TRA_ROLE_IS_U_TR] 
   ON  [dbo].[TRA_ROLE]
   INSTEAD OF UPDATE
AS 
BEGIN
	SET NOCOUNT ON;

	DECLARE @TEAM_CONC INT;
	SET @TEAM_CONC = (SELECT CONCURRENCY_CONTROL_NUMBER FROM TRA_ROLE WHERE TRA_ROLE.ROLE_ID = (SELECT ROLE_ID FROM inserted));
	DECLARE @INSERTED_CONC INT;
	SET @INSERTED_CONC = (SELECT CONCURRENCY_CONTROL_NUMBER FROM inserted);

	IF((@INSERTED_CONC) - (@TEAM_CONC) != 1)	 
	BEGIN
	RAISERROR('Concurrency Failure',16,10068);
	RETURN
	END
	
	ELSE
	BEGIN 	
	UPDATE TRA_ROLE
	SET
	TRA_ROLE.NAME = inserted.NAME,
	TRA_ROLE.DESCRIPTION = inserted.DESCRIPTION,
	TRA_ROLE.DB_CREATE_TIMESTAMP =	inserted.DB_CREATE_TIMESTAMP,
	TRA_ROLE.DB_CREATE_USERID = inserted.DB_CREATE_USERID,
	TRA_ROLE.DB_LAST_UPDATE_TIMESTAMP = CURRENT_TIMESTAMP,
	TRA_ROLE.DB_LAST_UPDATE_USERID = CURRENT_USER,
	TRA_ROLE.CONCURRENCY_CONTROL_NUMBER = inserted.CONCURRENCY_CONTROL_NUMBER
	FROM TRA_ROLE 
	INNER JOIN  inserted 
	ON TRA_ROLE.ROLE_ID = inserted.ROLE_ID;	
	END

END

GO
CREATE TRIGGER [dbo].[TRA_ROLE_IS_I_TR] 
   ON  [dbo].[TRA_ROLE]
   INSTEAD OF INSERT
AS 
BEGIN
	
	SET NOCOUNT ON;
	BEGIN
	INSERT INTO TRA_ROLE (
	   [NAME]
      ,[DESCRIPTION]
      ,[DB_CREATE_TIMESTAMP]
      ,[DB_CREATE_USERID]
      ,[DB_LAST_UPDATE_TIMESTAMP]
      ,[DB_LAST_UPDATE_USERID]
      ,[CONCURRENCY_CONTROL_NUMBER])
	
	SELECT 
	   [NAME]
      ,[DESCRIPTION]
      ,CURRENT_TIMESTAMP
      ,CURRENT_USER
      ,CURRENT_TIMESTAMP
      ,CURRENT_USER
      ,1
	FROM inserted
	END

	
	SELECT ROLE_ID FROM dbo.TRA_ROLE WHERE @@ROWCOUNT > 0 AND ROLE_ID = SCOPE_IDENTITY() 

END;