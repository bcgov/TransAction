CREATE TABLE [dbo].[TRA_CONTENT]
(
	[CONTENT_ID] INT NOT NULL PRIMARY KEY IDENTITY, 
    [BODY] VARCHAR(MAX) NOT NULL, 
    [SORT] INT NOT NULL DEFAULT 1, 
    [CONTENT_TYPE_ID] INT NOT NULL, 
    [DB_CREATE_TIMESTAMP] DATETIME NOT NULL,
    [DB_CREATE_USERID] VARCHAR(30) NOT NULL,
    [DB_LAST_UPDATE_TIMESTAMP] DATETIME NOT NULL,
    [DB_LAST_UPDATE_USERID] VARCHAR(30) NOT NULL,
    [CONCURRENCY_CONTROL_NUMBER] BIGINT NOT NULL DEFAULT 1
    CONSTRAINT [FK_TRA_CONTENT_CONTENT_TYPE] FOREIGN KEY ([CONTENT_TYPE_ID]) REFERENCES [TRA_CONTENT_TYPE]([CONTENT_TYPE_ID])
)

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_CONTENT',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created the record. ',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_CONTENT',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_USERID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created or last updated.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_CONTENT',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created or last updated the record. ',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_CONTENT',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_USERID'
GO

CREATE TRIGGER [dbo].[TRA_CONTENT_AS_I_TR] 
   ON  [dbo].[TRA_CONTENT]
   AFTER INSERT
AS 
BEGIN
	
	SET NOCOUNT ON;

	UPDATE TRA_CONTENT
	SET [DB_CREATE_TIMESTAMP] = CURRENT_TIMESTAMP
      ,[DB_CREATE_USERID] = CURRENT_USER
      ,[DB_LAST_UPDATE_TIMESTAMP] = CURRENT_TIMESTAMP
      ,[DB_LAST_UPDATE_USERID] = CURRENT_USER
      ,[CONCURRENCY_CONTROL_NUMBER] = 1

	FROM inserted
	WHERE TRA_CONTENT.CONTENT_ID = inserted.CONTENT_ID

END
GO

CREATE TRIGGER [dbo].[TRA_CONTENT_IS_U_TR] 
   ON  [dbo].[TRA_CONTENT]
   INSTEAD OF UPDATE
AS 
BEGIN
	SET NOCOUNT ON;

	DECLARE @FAIL_COUNT INT;
	SET @FAIL_COUNT = (
		SELECT COUNT(*) 
		FROM TRA_CONTENT

		JOIN inserted 
		ON TRA_CONTENT.CONTENT_ID = inserted.CONTENT_ID

		WHERE TRA_CONTENT.CONCURRENCY_CONTROL_NUMBER + 1 != inserted.CONCURRENCY_CONTROL_NUMBER
	)


	IF(@FAIL_COUNT != 0)	 
		BEGIN
		RAISERROR('Concurrency Failure',16,10068);
		RETURN
	END
	
	ELSE
	BEGIN 	
	UPDATE TRA_CONTENT
	SET
	TRA_CONTENT.BODY = inserted.BODY,
    TRA_CONTENT.SORT = inserted.SORT,
    TRA_CONTENT.CONTENT_TYPE_ID = inserted.CONTENT_TYPE_ID,
	TRA_CONTENT.DB_CREATE_TIMESTAMP =	inserted.DB_CREATE_TIMESTAMP,
	TRA_CONTENT.DB_CREATE_USERID = inserted.DB_CREATE_USERID,
	TRA_CONTENT.DB_LAST_UPDATE_TIMESTAMP = CURRENT_TIMESTAMP,
	TRA_CONTENT.DB_LAST_UPDATE_USERID = CURRENT_USER,
	TRA_CONTENT.CONCURRENCY_CONTROL_NUMBER = inserted.CONCURRENCY_CONTROL_NUMBER
	FROM TRA_CONTENT 
	INNER JOIN  inserted 
	ON TRA_CONTENT.CONTENT_ID = inserted.CONTENT_ID;	
	END

END