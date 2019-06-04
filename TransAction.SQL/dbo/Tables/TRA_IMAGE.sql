CREATE TABLE [dbo].[TRA_IMAGE]
(
	[IMAGE_ID] INT NOT NULL  IDENTITY, 
    [USER_ID] INT NULL, 
    [TEAM_ID] INT NULL, 
	[CAROUSEL] BIT NOT NULL DEFAULT 0,
	[FILENAME] VARCHAR(1024) NOT NULL,
	[FILESIZE] BIGINT NOT NULL,
	[CONTENT_TYPE] VARCHAR(512) NOT NULL,
    [DATA] VARBINARY(MAX) NOT NULL, 
	[WIDTH] INT NOT NULL, 
    [HEIGHT] INT NOT NULL, 
    [GUID] VARCHAR(36) NOT NULL,
	[DB_CREATE_TIMESTAMP] DATETIME NOT NULL,
    [DB_CREATE_USERID] VARCHAR(30) NOT NULL,
    [DB_LAST_UPDATE_TIMESTAMP] DATETIME NOT NULL,
    [DB_LAST_UPDATE_USERID] VARCHAR(30) NOT NULL,
    [CONCURRENCY_CONTROL_NUMBER] BIGINT NOT NULL DEFAULT 1, 
    CONSTRAINT [PK_IMAGE] PRIMARY KEY CLUSTERED ([IMAGE_ID] ASC), 
    CONSTRAINT [TRA_IMAGE_USER] FOREIGN KEY ([USER_ID]) REFERENCES [TRA_USER]([USER_ID]),
	CONSTRAINT [TRA_IMAGE_TEAM] FOREIGN KEY ([TEAM_ID]) REFERENCES [TRA_TEAM]([TEAM_ID]) 
)

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'User ID Foreign Key for identifying user profile images',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_IMAGE',
    @level2type = N'COLUMN',
    @level2name = N'USER_ID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Team ID Foreign Key for identifying team profile images',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_IMAGE',
    @level2type = N'COLUMN',
    @level2name = N'TEAM_ID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Binary data of the images',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_IMAGE',
    @level2type = N'COLUMN',
    @level2name = N'DATA'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'GUID for retrieving images',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_IMAGE',
    @level2type = N'COLUMN',
    @level2name = N'GUID'
GO

EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_IMAGE',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created the record. ',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_IMAGE',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_USERID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created or last updated.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_IMAGE',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created or last updated the record. ',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_IMAGE',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_USERID'
GO

EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Image width in pixels',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_IMAGE',
    @level2type = N'COLUMN',
    @level2name = N'WIDTH'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Image height in pixels',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_IMAGE',
    @level2type = N'COLUMN',
    @level2name = N'HEIGHT'

GO
CREATE TRIGGER [dbo].[TRA_IMAGE_IS_U_TR] 
   ON  [dbo].[TRA_IMAGE]
   INSTEAD OF UPDATE
AS 
BEGIN
	SET NOCOUNT ON;

	DECLARE @CONC INT;
	SET @CONC = (SELECT CONCURRENCY_CONTROL_NUMBER FROM TRA_IMAGE WHERE TRA_IMAGE.IMAGE_ID = (SELECT IMAGE_ID FROM inserted));
	DECLARE @INSERTED_CONC INT;
	SET @INSERTED_CONC = (SELECT CONCURRENCY_CONTROL_NUMBER FROM inserted);

	IF((@INSERTED_CONC) - (@CONC) != 1)	 
	BEGIN
	RAISERROR('Concurrency Failure',16,10068);
	RETURN
	END
	
	ELSE
	BEGIN 	
	UPDATE TRA_IMAGE
	SET
	TRA_IMAGE.[USER_ID] = inserted.[USER_ID],
	TRA_IMAGE.[TEAM_ID] = inserted.[TEAM_ID],
	TRA_IMAGE.[CAROUSEL] = inserted.[CAROUSEL],	
	TRA_IMAGE.[FILENAME] = inserted.[FILENAME],
	TRA_IMAGE.[FILESIZE] = inserted.[FILESIZE],
	TRA_IMAGE.[CONTENT_TYPE] = inserted.[CONTENT_TYPE],
	TRA_IMAGE.[DATA] = inserted.[DATA],
	TRA_IMAGE.[WIDTH] = inserted.[WIDTH],
	TRA_IMAGE.[HEIGHT] = inserted.[HEIGHT],
	TRA_IMAGE.[GUID] = inserted.[GUID],
	TRA_IMAGE.DB_CREATE_TIMESTAMP =	inserted.DB_CREATE_TIMESTAMP,
	TRA_IMAGE.DB_CREATE_USERID = inserted.DB_CREATE_USERID,
	TRA_IMAGE.DB_LAST_UPDATE_TIMESTAMP = CURRENT_TIMESTAMP,
	TRA_IMAGE.DB_LAST_UPDATE_USERID = CURRENT_USER,
	TRA_IMAGE.CONCURRENCY_CONTROL_NUMBER = inserted.CONCURRENCY_CONTROL_NUMBER 
	FROM TRA_IMAGE 
	INNER JOIN  inserted 
	ON TRA_IMAGE.IMAGE_ID = inserted.IMAGE_ID;	
	END

END

GO 
CREATE TRIGGER [dbo].[TRA_IMAGE_IS_I_TR] 
   ON  [dbo].[TRA_IMAGE]
   INSTEAD OF INSERT
AS 
BEGIN
	
	SET NOCOUNT ON;
	BEGIN
	INSERT INTO TRA_IMAGE(
	   [USER_ID]
      ,[TEAM_ID]
	  ,[CAROUSEL]
	  ,[FILENAME]
	  ,[FILESIZE]
	  ,[CONTENT_TYPE]
      ,[DATA]
	  ,[WIDTH]
	  ,[HEIGHT]
	  ,[GUID]
      ,[DB_CREATE_TIMESTAMP]
      ,[DB_CREATE_USERID]
      ,[DB_LAST_UPDATE_TIMESTAMP]
      ,[DB_LAST_UPDATE_USERID]
      ,[CONCURRENCY_CONTROL_NUMBER])
	
	SELECT 
	   [USER_ID]
      ,[TEAM_ID]
	  ,[CAROUSEL]
	  ,[FILENAME]
	  ,[FILESIZE]
	  ,[CONTENT_TYPE]
      ,[DATA]
	  ,[WIDTH]
	  ,[HEIGHT]
	  ,[GUID]
      ,CURRENT_TIMESTAMP
      ,CURRENT_USER
      ,CURRENT_TIMESTAMP
      ,CURRENT_USER
      ,1
	FROM inserted
	END

	
	SELECT IMAGE_ID FROM dbo.TRA_IMAGE WHERE @@ROWCOUNT > 0 AND IMAGE_ID = SCOPE_IDENTITY() 

END;
