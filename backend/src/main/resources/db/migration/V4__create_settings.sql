-- V4: Settings tables
CREATE TABLE IF NOT EXISTS payment_gateways (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    gateway_type VARCHAR(50) NOT NULL,
    api_key VARCHAR(500),
    secret_key VARCHAR(500),
    webhook_secret VARCHAR(500),
    mode ENUM('test','live') NOT NULL DEFAULT 'test',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    supported_currencies JSON,
    logo_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS smart_routing_rules (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    `condition_field` VARCHAR(100) NOT NULL,
    `condition_operator` VARCHAR(50) NOT NULL,
    `condition_value` VARCHAR(255) NOT NULL,
    gateway_id VARCHAR(100) NOT NULL,
    priority INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (gateway_id) REFERENCES payment_gateways(id)
);

CREATE TABLE IF NOT EXISTS tax_config (
    id INT NOT NULL PRIMARY KEY DEFAULT 1,
    price_type ENUM('exclusive','inclusive') NOT NULL DEFAULT 'exclusive',
    collect_tax_id BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO tax_config (id, price_type) VALUES (1, 'exclusive');

CREATE TABLE IF NOT EXISTS tax_regions (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    country VARCHAR(2) NOT NULL,
    state VARCHAR(100),
    tax_name VARCHAR(100) NOT NULL,
    tax_rate DECIMAL(5,2) NOT NULL,
    status ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS api_keys (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    key_prefix VARCHAR(20) NOT NULL,
    key_hash VARCHAR(500) NOT NULL,
    permissions JSON,
    status ENUM('active','revoked') NOT NULL DEFAULT 'active',
    last_used_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS webhooks (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    url VARCHAR(1000) NOT NULL,
    subscribed_events JSON NOT NULL,
    secret VARCHAR(500),
    status ENUM('active','inactive') NOT NULL DEFAULT 'active',
    last_triggered_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS webhook_deliveries (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    webhook_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSON,
    response_status INT,
    response_body TEXT,
    delivered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (webhook_id) REFERENCES webhooks(id)
);

CREATE TABLE IF NOT EXISTS team_members (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    user_id VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('ADMIN','BILLING_MANAGER','SUPPORT','READ_ONLY') NOT NULL DEFAULT 'READ_ONLY',
    status ENUM('ACTIVE','INACTIVE','INVITED') NOT NULL DEFAULT 'INVITED',
    invite_token VARCHAR(500),
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS custom_fields (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    field_name VARCHAR(255) NOT NULL,
    entity_type ENUM('customer','subscription','invoice','plan') NOT NULL,
    field_type ENUM('text','number','dropdown','date','boolean') NOT NULL,
    is_required BOOLEAN NOT NULL DEFAULT FALSE,
    dropdown_options JSON,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS currencies (
    id VARCHAR(10) NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    exchange_rate DECIMAL(15,6) NOT NULL DEFAULT 1.0,
    is_base BOOLEAN NOT NULL DEFAULT FALSE,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO currencies (id, name, symbol, exchange_rate, is_base) VALUES
('USD', 'US Dollar', '$', 1.000000, TRUE),
('EUR', 'Euro', '€', 0.920000, FALSE),
('GBP', 'British Pound', '£', 0.790000, FALSE),
('INR', 'Indian Rupee', '₹', 83.500000, FALSE);

CREATE TABLE IF NOT EXISTS business_profile (
    id INT NOT NULL PRIMARY KEY DEFAULT 1,
    company_name VARCHAR(255),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(2),
    logo_url VARCHAR(500),
    tax_registration_number VARCHAR(100),
    fiscal_year_start_month INT DEFAULT 1,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO business_profile (id) VALUES (1);
