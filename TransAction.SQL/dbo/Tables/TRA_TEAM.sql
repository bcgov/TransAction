﻿CREATE TABLE [dbo].[TRA_TEAM] (
    [TEAM_ID]           INT            IDENTITY (1, 1) NOT NULL,
    [REGION]       VARCHAR(255) NOT NULL,
    [DESCRIPTION]   TEXT NOT NULL,
    [PROGRESS_BAR] INT NOT NULL,
    [USER_ID]   INT NOT NULL,
	[EFFECTIVE_START_DATE] DATETIME NULL, 
	[EFFECTIVE_END_DATE] DATETIME NULL, 
	[CREATED_BY_USER] VARCHAR(255) NULL, 
	[CREATED_BY_DATE] DATETIME NULL, 
	[LAST_UPDATED_BY_USER] VARCHAR(255) NULL, 
	[LAST_UPDATED_BY_DATE] DATETIME NULL,
    CONSTRAINT [PK_TEAM] PRIMARY KEY CLUSTERED ([TEAM_ID] ASC), 
    CONSTRAINT [FK_TEAM_USER] FOREIGN KEY ([USER_ID]) REFERENCES [TRA_USER]([USER_ID])
);

