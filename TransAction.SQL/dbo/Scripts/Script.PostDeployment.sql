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
    INSERT INTO TRA_ROLE ([NAME], [DESCRIPTION], [DB_CREATE_TIMESTAMP], [DB_CREATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [CONCURRENCY_CONTROL_NUMBER]) 
		VALUES ('Admin', 'Admin role', GETDATE(), 'Transaction_Dev', GETDATE(), 'Transaction_Dev', 1)
	INSERT INTO TRA_ROLE ([NAME], [DESCRIPTION], [DB_CREATE_TIMESTAMP], [DB_CREATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [CONCURRENCY_CONTROL_NUMBER])
		VALUES ('User', 'User role', GETDATE(), 'Transaction_Dev', GETDATE(), 'Transaction_Dev', 1)
END

-- Seed TRA_REGION Table

IF NOT EXISTS (SELECT 1 FROM TRA_REGION)
BEGIN
    INSERT INTO TRA_REGION ([NAME], [DESCRIPTION], [DB_CREATE_TIMESTAMP], [DB_CREATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [CONCURRENCY_CONTROL_NUMBER])
		VALUES ('HQ', 'HQ', GETDATE(), 'Transaction_Dev', GETDATE(), 'Transaction_Dev', 1)
	INSERT INTO TRA_REGION ([NAME], [DESCRIPTION], [DB_CREATE_TIMESTAMP], [DB_CREATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [CONCURRENCY_CONTROL_NUMBER])
		VALUES ('REGION 1', 'REGION 1', GETDATE(), 'Transaction_Dev', GETDATE(), 'Transaction_Dev', 1)
	INSERT INTO TRA_REGION ([NAME], [DESCRIPTION], [DB_CREATE_TIMESTAMP], [DB_CREATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [CONCURRENCY_CONTROL_NUMBER]) 
		VALUES ('REGION 2', 'REGION 2', GETDATE(), 'Transaction_Dev', GETDATE(), 'Transaction_Dev', 1)
	INSERT INTO TRA_REGION ([NAME], [DESCRIPTION], [DB_CREATE_TIMESTAMP], [DB_CREATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [CONCURRENCY_CONTROL_NUMBER]) 
		VALUES ('REGION 3', 'REGION 3', GETDATE(), 'Transaction_Dev', GETDATE(), 'Transaction_Dev', 1)
END

-- Seed TRA_ACTIVITY Table

IF NOT EXISTS (SELECT 1 FROM TRA_ACTIVITY)
BEGIN
    INSERT INTO TRA_ACTIVITY ([NAME], [DESCRIPTION], [INTENSITY], [DB_CREATE_TIMESTAMP], [DB_CREATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [CONCURRENCY_CONTROL_NUMBER])
		VALUES ('Low', 'Low intensity activity', 1, GETDATE(), 'Transaction_Dev', GETDATE(), 'Transaction_Dev', 1)
	INSERT INTO TRA_ACTIVITY ([NAME], [DESCRIPTION], [INTENSITY], [DB_CREATE_TIMESTAMP], [DB_CREATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [CONCURRENCY_CONTROL_NUMBER])
		VALUES ('Medium', 'Medium intensity activity', 2, GETDATE(), 'Transaction_Dev', GETDATE(), 'Transaction_Dev', 1)
	INSERT INTO TRA_ACTIVITY ([NAME], [DESCRIPTION], [INTENSITY], [DB_CREATE_TIMESTAMP], [DB_CREATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [CONCURRENCY_CONTROL_NUMBER]) 
		VALUES ('High', 'High intensity activity', 3, GETDATE(), 'Transaction_Dev', GETDATE(), 'Transaction_Dev', 1)
END
