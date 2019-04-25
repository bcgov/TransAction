CREATE TABLE [dbo].[TRA_TOPIC] (
    [TOPIC_ID]      INT            IDENTITY (1, 1) NOT NULL,
    [TITLE]   VARCHAR(1024) NOT NULL,
    [USER_ID] INT            NOT NULL,
	[DB_CREATE_TIMESTAMP] DATETIME NOT NULL, 
	[DB_CREATE_USERID] VARCHAR(30) NOT NULL, 
	[DB_LAST_UPDATE_TIMESTAMP] DATETIME NOT NULL, 
	[DB_LAST_UPDATE_USERID] VARCHAR(30) NOT NULL,
    [CONCURRENCY_CONTROL_NUMBER] BIGINT NOT NULL DEFAULT 1, 
    CONSTRAINT [PK_TOPIC] PRIMARY KEY CLUSTERED ([TOPIC_ID] ASC),
    CONSTRAINT [FK_TOPIC_USER] FOREIGN KEY ([USER_ID]) REFERENCES [dbo].[TRA_USER] ([USER_ID])
);


GO
CREATE NONCLUSTERED INDEX [IX_FK_TOPIC_USER]
    ON [dbo].[TRA_TOPIC_MESSAGE]([USER_ID] ASC);


GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_TOPIC',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created the record. ',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_TOPIC',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_USERID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created or last updated.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_TOPIC',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created or last updated the record.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_TOPIC',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_USERID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Keeps track of the topics in a message board',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_TOPIC',
    @level2type = NULL,
    @level2name = NULL

	GO
CREATE TRIGGER [dbo].[TRA_TOPIC_IS_U_TR] 
   ON  [dbo].[TRA_TOPIC]
   INSTEAD OF UPDATE
AS 
BEGIN
	SET NOCOUNT ON;

	DECLARE @TEAM_CONC INT;
	SET @TEAM_CONC = (SELECT CONCURRENCY_CONTROL_NUMBER FROM TRA_TOPIC WHERE TRA_TOPIC.TOPIC_ID = (SELECT TOPIC_ID FROM inserted));
	DECLARE @INSERTED_CONC INT;
	SET @INSERTED_CONC = (SELECT CONCURRENCY_CONTROL_NUMBER FROM inserted);

	IF((@INSERTED_CONC) - (@TEAM_CONC) != 1)	 
	BEGIN
	RAISERROR('Concurrency Failure',16,10068);
	RETURN
	END
	
	ELSE
	BEGIN 	
	UPDATE TRA_TOPIC
	SET
	TRA_TOPIC.TITLE = inserted.TITLE,
	TRA_TOPIC.USER_ID = inserted.USER_ID,
	TRA_TOPIC.DB_CREATE_TIMESTAMP =	inserted.DB_CREATE_TIMESTAMP,
	TRA_TOPIC.DB_CREATE_USERID = inserted.DB_CREATE_USERID,
	TRA_TOPIC.DB_LAST_UPDATE_TIMESTAMP = CURRENT_TIMESTAMP,
	TRA_TOPIC.DB_LAST_UPDATE_USERID = CURRENT_USER,
	TRA_TOPIC.CONCURRENCY_CONTROL_NUMBER = inserted.CONCURRENCY_CONTROL_NUMBER
	FROM TRA_TOPIC 
	INNER JOIN  inserted 
	ON TRA_TOPIC.TOPIC_ID = inserted.TOPIC_ID;	
	END

END

GO
CREATE TRIGGER [dbo].[TRA_TOPIC_IS_I_TR] 
   ON  [dbo].[TRA_TOPIC]
   INSTEAD OF INSERT
AS 
BEGIN
	
	SET NOCOUNT ON;
	BEGIN
	INSERT INTO TRA_TOPIC (
	   [TITLE]
      ,[USER_ID]
      ,[DB_CREATE_TIMESTAMP]
      ,[DB_CREATE_USERID]
      ,[DB_LAST_UPDATE_TIMESTAMP]
      ,[DB_LAST_UPDATE_USERID]
      ,[CONCURRENCY_CONTROL_NUMBER])
	
	SELECT 
	   [TITLE]
      ,[USER_ID]
      ,CURRENT_TIMESTAMP
      ,CURRENT_USER
      ,CURRENT_TIMESTAMP
      ,CURRENT_USER
      ,1
	FROM inserted
	END

	
	SELECT TOPIC_ID FROM dbo.TRA_TOPIC WHERE @@ROWCOUNT > 0 AND TOPIC_ID = SCOPE_IDENTITY() 

END;