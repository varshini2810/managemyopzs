-- V17: Add missing BaseEntity columns to Phase 3 & 4 tables

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

-- Customers
CALL AddColumnSafely('customers', 'tenant_id', 'VARCHAR(100)');
CALL AddColumnSafely('customers', 'created_by', 'VARCHAR(100)');
CALL AddColumnSafely('customers', 'updated_by', 'VARCHAR(100)');

CALL AddColumnSafely('customer_payment_methods', 'tenant_id', 'VARCHAR(100)');
CALL AddColumnSafely('customer_payment_methods', 'created_by', 'VARCHAR(100)');
CALL AddColumnSafely('customer_payment_methods', 'updated_by', 'VARCHAR(100)');

CALL AddColumnSafely('customer_contacts', 'tenant_id', 'VARCHAR(100)');
CALL AddColumnSafely('customer_contacts', 'created_by', 'VARCHAR(100)');
CALL AddColumnSafely('customer_contacts', 'updated_by', 'VARCHAR(100)');

CALL AddColumnSafely('customer_custom_field_values', 'tenant_id', 'VARCHAR(100)');
CALL AddColumnSafely('customer_custom_field_values', 'created_by', 'VARCHAR(100)');
CALL AddColumnSafely('customer_custom_field_values', 'updated_by', 'VARCHAR(100)');

-- Subscriptions
CALL AddColumnSafely('subscriptions', 'tenant_id', 'VARCHAR(100)');
CALL AddColumnSafely('subscriptions', 'created_by', 'VARCHAR(100)');
CALL AddColumnSafely('subscriptions', 'updated_by', 'VARCHAR(100)');

CALL AddColumnSafely('subscription_addons', 'tenant_id', 'VARCHAR(100)');
CALL AddColumnSafely('subscription_addons', 'created_by', 'VARCHAR(100)');
CALL AddColumnSafely('subscription_addons', 'updated_by', 'VARCHAR(100)');

CALL AddColumnSafely('subscription_events', 'tenant_id', 'VARCHAR(100)');
CALL AddColumnSafely('subscription_events', 'created_by', 'VARCHAR(100)');
CALL AddColumnSafely('subscription_events', 'updated_by', 'VARCHAR(100)');

-- Invoices
CALL AddColumnSafely('invoices', 'tenant_id', 'VARCHAR(100)');
CALL AddColumnSafely('invoices', 'created_by', 'VARCHAR(100)');
CALL AddColumnSafely('invoices', 'updated_by', 'VARCHAR(100)');

CALL AddColumnSafely('invoice_line_items', 'tenant_id', 'VARCHAR(100)');
CALL AddColumnSafely('invoice_line_items', 'created_by', 'VARCHAR(100)');
CALL AddColumnSafely('invoice_line_items', 'updated_by', 'VARCHAR(100)');

-- Credit Notes
CALL AddColumnSafely('credit_notes', 'tenant_id', 'VARCHAR(100)');
CALL AddColumnSafely('credit_notes', 'created_by', 'VARCHAR(100)');
CALL AddColumnSafely('credit_notes', 'updated_by', 'VARCHAR(100)');

CALL AddColumnSafely('credit_note_line_items', 'tenant_id', 'VARCHAR(100)');
CALL AddColumnSafely('credit_note_line_items', 'created_by', 'VARCHAR(100)');
CALL AddColumnSafely('credit_note_line_items', 'updated_by', 'VARCHAR(100)');

DROP PROCEDURE IF EXISTS AddColumnSafely;
