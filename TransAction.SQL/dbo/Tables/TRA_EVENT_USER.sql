CREATE TABLE [dbo].[TRA_EVENT_USER]
(
    [EVENT_USER_ID] INT IDENTITY (1, 1) NOT NULL,
    [EVENT_ID] INT NOT NULL,
    [USER_ID] INT NOT NULL,
    [DB_CREATE_TIMESTAMP] DATETIME NOT NULL,
    [DB_CREATE_USERID] VARCHAR(30) NOT NULL,
    [DB_LAST_UPDATE_TIMESTAMP] DATETIME NOT NULL,
    [DB_LAST_UPDATE_USERID] VARCHAR(30) NOT NULL,
    [CONCURRENCY_CONTROL_NUMBER] BIGINT NOT NULL DEFAULT 1,
    CONSTRAINT [PK_EVENT_USER] PRIMARY KEY CLUSTERED ([EVENT_USER_ID] ASC),
    CONSTRAINT [FK_EVENT_USER_EVENT] FOREIGN KEY ([EVENT_ID]) REFERENCES [dbo].[TRA_EVENT] ([EVENT_ID]),
    CONSTRAINT [FK_EVENT_USER_USER] FOREIGN KEY ([USER_ID]) REFERENCES [dbo].[TRA_USER] ([USER_ID])
);


GO
CREATE NONCLUSTERED INDEX [IX_FK_EVENT_USER_EVENT]
    ON [dbo].[TRA_EVENT_USER]([EVENT_ID] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_FK_EVENT_USER_USER]
    ON [dbo].[TRA_EVENT_USER]([USER_ID] ASC);


GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_EVENT_USER',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created the record. ',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_EVENT_USER',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_USERID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created or last updated.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_EVENT_USER',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created or last updated the record. ',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_EVENT_USER',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_USERID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Keeps track of all the events and the users that participated in it',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_EVENT_USER',
    @level2type = NULL,
    @level2name = NULL

GO
CREATE TRIGGER [dbo].[TRA_EVENT_USER_IS_U_TR] 
   ON  [dbo].[TRA_EVENT_USER]
   INSTEAD OF UPDATE
AS 
BEGIN
	SET NOCOUNT ON;

	DECLARE @TEAM_CONC INT;
	SET @TEAM_CONC = (SELECT CONCURRENCY_CONTROL_NUMBER FROM TRA_EVENT_USER WHERE TRA_EVENT_USER.EVENT_USER_ID = (SELECT EVENT_USER_ID FROM inserted));
	DECLARE @INSERTED_CONC INT;
	SET @INSERTED_CONC = (SELECT CONCURRENCY_CONTROL_NUMBER FROM inserted);

	IF((@INSERTED_CONC) - (@TEAM_CONC) != 1)	 
	BEGIN
	RAISERROR('Concurrency Failure',16,10068);
	RETURN
	END
	
	ELSE
	BEGIN 	
	UPDATE TRA_EVENT_USER
	SET
	TRA_EVENT_USER.EVENT_ID = inserted.EVENT_ID,
	TRA_EVENT_USER.USER_ID = inserted.USER_ID,
	TRA_EVENT_USER.DB_CREATE_TIMESTAMP =	inserted.DB_CREATE_TIMESTAMP,
	TRA_EVENT_USER.DB_CREATE_USERID = inserted.DB_CREATE_USERID,
	TRA_EVENT_USER.DB_LAST_UPDATE_TIMESTAMP = CURRENT_TIMESTAMP,
	TRA_EVENT_USER.DB_LAST_UPDATE_USERID = CURRENT_USER,
	TRA_EVENT_USER.CONCURRENCY_CONTROL_NUMBER = inserted.CONCURRENCY_CONTROL_NUMBER
	FROM TRA_EVENT_USER 
	INNER JOIN  inserted 
	ON TRA_EVENT_USER.EVENT_USER_ID = inserted.EVENT_USER_ID;	
	END

END

GO
 CREATE TRIGGER [dbo].[TRA_EVENT_USER_AS_I_TR] 
   ON  [dbo].[TRA_EVENT_USER]
   AFTER INSERT
AS 
BEGIN
	
	SET NOCOUNT ON;

	UPDATE TRA_EVENT_USER
	SET [DB_CREATE_TIMESTAMP] = CURRENT_TIMESTAMP
      ,[DB_CREATE_USERID] = CURRENT_USER
      ,[DB_LAST_UPDATE_TIMESTAMP] = CURRENT_TIMESTAMP
      ,[DB_LAST_UPDATE_USERID] = CURRENT_USER
      ,[CONCURRENCY_CONTROL_NUMBER] = 1

	FROM inserted
	WHERE TRA_EVENT_USER.EVENT_USER_ID = inserted.EVENT_USER_ID

END
