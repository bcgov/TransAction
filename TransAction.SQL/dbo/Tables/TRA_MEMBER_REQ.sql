CREATE TABLE [dbo].[TRA_MEMBER_REQ]
(
    [MEMBER_REQ_ID] INT IDENTITY (1, 1) NOT NULL,
    [USER_ID] INT NOT NULL,
    [TEAM_ID] INT NOT NULL,
	[IS_ACTIVE] BIT NOT NULL DEFAULT 1, 
    [DB_CREATE_TIMESTAMP] DATETIME NOT NULL,
    [DB_CREATE_USERID] VARCHAR(30) NOT NULL,
    [DB_LAST_UPDATE_TIMESTAMP] DATETIME NOT NULL,
    [DB_LAST_UPDATE_USERID] VARCHAR(30) NOT NULL,
    [CONCURRENCY_CONTROL_NUMBER] BIGINT NOT NULL DEFAULT 1,    
    CONSTRAINT [PK_MEMBER_REQ] PRIMARY KEY CLUSTERED ([MEMBER_REQ_ID] ASC),
    CONSTRAINT [FK_MEMBER_REQ_TEAM] FOREIGN KEY ([TEAM_ID]) REFERENCES [dbo].[TRA_TEAM] ([TEAM_ID]),
    CONSTRAINT [FK_MEMBER_REQ_USER] FOREIGN KEY ([USER_ID]) REFERENCES [dbo].[TRA_USER] ([USER_ID])
);


GO
CREATE NONCLUSTERED INDEX [IX_FK_MEMBER_REQ_USER]
    ON [dbo].[TRA_MEMBER_REQ]([USER_ID] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_FK_MEMBER_REQ_TEAM]
    ON [dbo].[TRA_MEMBER_REQ]([TEAM_ID] ASC);


GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_MEMBER_REQ',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created the record. ',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_MEMBER_REQ',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_USERID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created or last updated.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_MEMBER_REQ',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created or last updated the record. ',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_MEMBER_REQ',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_USERID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Keeps track of the req sent by a user to a team',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_MEMBER_REQ',
    @level2type = NULL,
    @level2name = NULL

	GO 
	CREATE TRIGGER [dbo].[TRA_MEMBER_REQ_IS_U_TR] 
   ON  [dbo].[TRA_MEMBER_REQ]
   INSTEAD OF UPDATE
AS 
BEGIN
	SET NOCOUNT ON;

	DECLARE @TEAM_CONC INT;
	SET @TEAM_CONC = (SELECT CONCURRENCY_CONTROL_NUMBER FROM TRA_MEMBER_REQ WHERE TRA_MEMBER_REQ.MEMBER_REQ_ID = (SELECT MEMBER_REQ_ID FROM inserted));
	DECLARE @INSERTED_CONC INT;
	SET @INSERTED_CONC = (SELECT CONCURRENCY_CONTROL_NUMBER FROM inserted);

	IF((@INSERTED_CONC) - (@TEAM_CONC) != 1)	 
	BEGIN
	RAISERROR('Concurrency Failure',16,10068);
	RETURN
	END
	
	ELSE
	BEGIN 	
	UPDATE TRA_MEMBER_REQ
	SET
	TRA_MEMBER_REQ.USER_ID = inserted.USER_ID,
	TRA_MEMBER_REQ.TEAM_ID = inserted.TEAM_ID,
	TRA_MEMBER_REQ.IS_ACTIVE = inserted.IS_ACTIVE,
	TRA_MEMBER_REQ.DB_CREATE_TIMESTAMP =	inserted.DB_CREATE_TIMESTAMP,
	TRA_MEMBER_REQ.DB_CREATE_USERID = inserted.DB_CREATE_USERID,
	TRA_MEMBER_REQ.DB_LAST_UPDATE_TIMESTAMP = CURRENT_TIMESTAMP,
	TRA_MEMBER_REQ.DB_LAST_UPDATE_USERID = CURRENT_USER,
	TRA_MEMBER_REQ.CONCURRENCY_CONTROL_NUMBER = inserted.CONCURRENCY_CONTROL_NUMBER
	FROM TRA_MEMBER_REQ 
	INNER JOIN  inserted 
	ON TRA_MEMBER_REQ.MEMBER_REQ_ID = inserted.MEMBER_REQ_ID;	
	END

END

GO
CREATE   TRIGGER [dbo].[TRA_MEMBER_REQ_AS_I_TR] 
   ON  [dbo].[TRA_MEMBER_REQ]
   AFTER INSERT
AS 
BEGIN
	
	SET NOCOUNT ON;

	UPDATE TRA_MEMBER_REQ
	SET [DB_CREATE_TIMESTAMP] = CURRENT_TIMESTAMP
      ,[DB_CREATE_USERID] = CURRENT_USER
      ,[DB_LAST_UPDATE_TIMESTAMP] = CURRENT_TIMESTAMP
      ,[DB_LAST_UPDATE_USERID] = CURRENT_USER
      ,[CONCURRENCY_CONTROL_NUMBER] = 1

	FROM inserted
	WHERE TRA_MEMBER_REQ.MEMBER_REQ_ID = inserted.MEMBER_REQ_ID

END
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Keeps track if the member reqis active',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_MEMBER_REQ',
    @level2type = N'COLUMN',
    @level2name = N'IS_ACTIVE'
