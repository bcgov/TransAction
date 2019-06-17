CREATE TABLE [dbo].[TRA_REGION]
(
    [REGION_ID] INT IDENTITY (1, 1) NOT NULL,
    [NAME] VARCHAR(255) NOT NULL,    
    [DESCRIPTION] TEXT NOT NULL,
    [DB_CREATE_TIMESTAMP] DATETIME NOT NULL,
    [DB_CREATE_USERID] VARCHAR(30) NOT NULL,
    [DB_LAST_UPDATE_TIMESTAMP] DATETIME NOT NULL,
    [DB_LAST_UPDATE_USERID] VARCHAR(30) NOT NULL,
    [CONCURRENCY_CONTROL_NUMBER] BIGINT NOT NULL DEFAULT 1,
    CONSTRAINT [PK_REGION] PRIMARY KEY CLUSTERED ([REGION_ID] ASC),
);
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_REGION',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created the record. ',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_REGION',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_USERID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created or last updated.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_REGION',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created or last updated the record. ',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_REGION',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_USERID'


GO
CREATE TRIGGER [dbo].[TRA_REGION_IS_U_TR] 
   ON  [dbo].[TRA_REGION]
   INSTEAD OF UPDATE
AS 
BEGIN
	SET NOCOUNT ON;

	DECLARE @TEAM_CONC INT;
	SET @TEAM_CONC = (SELECT CONCURRENCY_CONTROL_NUMBER FROM TRA_REGION WHERE TRA_REGION.REGION_ID = (SELECT REGION_ID FROM inserted));
	DECLARE @INSERTED_CONC INT;
	SET @INSERTED_CONC = (SELECT CONCURRENCY_CONTROL_NUMBER FROM inserted);

	IF((@INSERTED_CONC) - (@TEAM_CONC) != 1)	 
	BEGIN
	RAISERROR('Concurrency Failure',16,10068);
	RETURN
	END
	
	ELSE
	BEGIN 	
	UPDATE TRA_REGION
	SET
	TRA_REGION.NAME = inserted.NAME,
	TRA_REGION.DESCRIPTION = inserted.DESCRIPTION,
	TRA_REGION.DB_CREATE_TIMESTAMP =	inserted.DB_CREATE_TIMESTAMP,
	TRA_REGION.DB_CREATE_USERID = inserted.DB_CREATE_USERID,
	TRA_REGION.DB_LAST_UPDATE_TIMESTAMP = CURRENT_TIMESTAMP,
	TRA_REGION.DB_LAST_UPDATE_USERID = CURRENT_USER,
	TRA_REGION.CONCURRENCY_CONTROL_NUMBER = inserted.CONCURRENCY_CONTROL_NUMBER
	FROM TRA_REGION 
	INNER JOIN  inserted 
	ON TRA_REGION.REGION_ID = inserted.REGION_ID;	
	END

END

GO
CREATE TRIGGER [dbo].[TRA_REGION_AS_I_TR] 
   ON  [dbo].[TRA_REGION]
   AFTER INSERT
AS 
BEGIN
	
	SET NOCOUNT ON;

	UPDATE TRA_REGION
	SET [DB_CREATE_TIMESTAMP] = CURRENT_TIMESTAMP
      ,[DB_CREATE_USERID] = CURRENT_USER
      ,[DB_LAST_UPDATE_TIMESTAMP] = CURRENT_TIMESTAMP
      ,[DB_LAST_UPDATE_USERID] = CURRENT_USER
      ,[CONCURRENCY_CONTROL_NUMBER] = 1

	FROM inserted
	WHERE TRA_REGION.REGION_ID = inserted.REGION_ID

END