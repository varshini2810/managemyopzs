-- V12: Create app integrations table
CREATE TABLE IF NOT EXISTS app_integrations (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    app_id VARCHAR(100) NOT NULL UNIQUE,
    app_name VARCHAR(100) NOT NULL,
    category ENUM('PAYMENT', 'ACCOUNTING', 'CRM', 'TAX') NOT NULL,
    status ENUM('CONNECTED', 'DISCONNECTED') NOT NULL DEFAULT 'DISCONNECTED',
    config_json TEXT,
    connected_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed available apps
INSERT INTO app_integrations (id, app_id, app_name, category, status) VALUES
('app-str-01', 'stripe', 'Stripe', 'PAYMENT', 'DISCONNECTED'),
('app-xro-01', 'xero', 'Xero', 'ACCOUNTING', 'DISCONNECTED'),
('app-qbo-01', 'quickbooks', 'QuickBooks', 'ACCOUNTING', 'DISCONNECTED'),
('app-sfd-01', 'salesforce', 'Salesforce', 'CRM', 'DISCONNECTED');
