/*
Post-Deployment Script Template							
--------------------------------------------------------------------------------------
 This file contains SQL statements that will be appended to the build script.		
 Use SQLCMD syntax to include a file in the post-deployment script.			
 Example:      :r .\myfile.sql								
 Use SQLCMD syntax to reference a variable in the post-deployment script.		
 Example:      :setvar TableName MyTable							
               SELECT * FROM [$(TableName)]					
--------------------------------------------------------------------------------------
*/


-- Seed TRA_ROLE Table

IF NOT EXISTS (SELECT 1 FROM TRA_ROLE)
BEGIN
    INSERT INTO TRA_ROLE ([NAME], [DESCRIPTION]) VALUES ('Admin', 'Admin role')
	INSERT INTO TRA_ROLE ([NAME], [DESCRIPTION]) VALUES ('User', 'User role')
	INSERT INTO TRA_ROLE ([NAME], [DESCRIPTION]) VALUES ('Team_Lead', 'Team Lead role')
END

-- Seed TRA_REGION Table

IF NOT EXISTS (SELECT 1 FROM TRA_REGION)
BEGIN
    INSERT INTO TRA_REGION ([NAME], [DESCRIPTION]) VALUES ('HQ', 'HQ')
	INSERT INTO TRA_REGION ([NAME], [DESCRIPTION]) VALUES ('REGION 1', 'REGION 1')
	INSERT INTO TRA_REGION ([NAME], [DESCRIPTION]) VALUES ('REGION 2', 'REGION 2')
	INSERT INTO TRA_REGION ([NAME], [DESCRIPTION]) VALUES ('REGION 3', 'REGION 3')
END

-- Seed TRA_ACTIVITY Table

IF NOT EXISTS (SELECT 1 FROM TRA_ACTIVITY)
BEGIN
    INSERT INTO TRA_ACTIVITY ([NAME], [DESCRIPTION], [INTENSITY]) VALUES ('Low', 'Low intensity activity', 1)
	INSERT INTO TRA_ACTIVITY ([NAME], [DESCRIPTION], [INTENSITY]) VALUES ('Medium', 'Medium intensity activity', 2)
	INSERT INTO TRA_ACTIVITY ([NAME], [DESCRIPTION], [INTENSITY]) VALUES ('High', 'High intensity activity', 3)
END