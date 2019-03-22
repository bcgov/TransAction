CREATE TABLE [dbo].[TRA_TOPIC_MESSAGE] (
    [TOPIC_MESSAGE_ID]        INT            IDENTITY (1, 1) NOT NULL,
    [USER_ID]   INT            NOT NULL,
    [BODY]     TEXT NOT NULL,
    [TOPIC_ID] INT            NOT NULL,
	[DB_CREATE_TIMESTAMP] DATETIME NOT NULL, 
	[DB_CREATE_USERID] VARCHAR(30) NOT NULL, 
	[DB_LAST_UPDATE_TIMESTAMP] DATETIME NOT NULL, 
	[DB_LAST_UPDATE_USERID] VARCHAR(30) NOT NULL,
    [CONCURRENCY_CONTROL_NUMBER] BIGINT NOT NULL DEFAULT 1, 
    CONSTRAINT [PK_TOPIC_MESSAGE] PRIMARY KEY CLUSTERED ([TOPIC_MESSAGE_ID] ASC),
    CONSTRAINT [FK_TOPIC_MESSAGE_TOPIC] FOREIGN KEY ([TOPIC_ID]) REFERENCES [dbo].[TRA_TOPIC] ([TOPIC_ID]),
    CONSTRAINT [FK_TOPIC_MESSAGE_USER] FOREIGN KEY ([USER_ID]) REFERENCES [dbo].[TRA_USER] ([USER_ID])
);


GO
CREATE NONCLUSTERED INDEX [IX_FK_TOPIC_MESSAGE_USER]
    ON [dbo].[TRA_TOPIC_MESSAGE]([USER_ID] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_FK_TOPIC_MESSAGE_TOPIC]
    ON [dbo].[TRA_TOPIC_MESSAGE]([TOPIC_ID] ASC);


GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_TOPIC_MESSAGE',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created the record. **',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_TOPIC_MESSAGE',
    @level2type = N'COLUMN',
    @level2name = N'DB_CREATE_USERID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The date and time the record was created or last updated.',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_TOPIC_MESSAGE',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'The user or proxy account that created or last updated the record. **',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'TRA_TOPIC_MESSAGE',
    @level2type = N'COLUMN',
    @level2name = N'DB_LAST_UPDATE_USERID'