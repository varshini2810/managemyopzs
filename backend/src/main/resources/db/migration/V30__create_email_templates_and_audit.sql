-- V30: Create email templates and email template audit logs tables
CREATE TABLE IF NOT EXISTS email_templates (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    tenant_id VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    sender_name VARCHAR(100) NULL,
    sender_email VARCHAR(255) NULL,
    body TEXT NULL,
    status BOOLEAN NOT NULL DEFAULT TRUE,
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_template_audit_logs (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    template_id VARCHAR(100) NOT NULL,
    tenant_id VARCHAR(100) NOT NULL,
    user_id VARCHAR(100) NULL,
    action VARCHAR(50) NULL,
    previous_body TEXT NULL,
    new_body TEXT NULL,
    version INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
