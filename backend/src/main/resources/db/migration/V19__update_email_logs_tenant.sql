-- V19: Update email_logs to be multi-tenant aware and use BaseEntity columns

DROP PROCEDURE IF EXISTS AddColumnSafely;
DELIMITER //
CREATE PROCEDURE AddColumnSafely(IN tableName VARCHAR(255), IN colName VARCHAR(255), IN colType VARCHAR(255))
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = tableName
        AND COLUMN_NAME = colName
    ) THEN
        SET @s = CONCAT('ALTER TABLE ', tableName, ' ADD COLUMN ', colName, ' ', colType);
        PREPARE stmt FROM @s;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END //
DELIMITER ;

CALL AddColumnSafely('email_logs', 'tenant_id', 'VARCHAR(100)');
CALL AddColumnSafely('email_logs', 'created_by', 'VARCHAR(100)');
CALL AddColumnSafely('email_logs', 'updated_by', 'VARCHAR(100)');
CALL AddColumnSafely('email_logs', 'updated_at', 'TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP');
CALL AddColumnSafely('email_logs', 'deleted_at', 'TIMESTAMP NULL');

-- Add a foreign key to tenants if it doesn't exist
DELIMITER //
CREATE PROCEDURE AddForeignKeySafely()
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'email_logs'
        AND CONSTRAINT_NAME = 'fk_email_logs_tenant'
    ) THEN
        ALTER TABLE email_logs ADD CONSTRAINT fk_email_logs_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
    END IF;
END //
DELIMITER ;

CALL AddForeignKeySafely();

DROP PROCEDURE IF EXISTS AddColumnSafely;
DROP PROCEDURE IF EXISTS AddForeignKeySafely;
