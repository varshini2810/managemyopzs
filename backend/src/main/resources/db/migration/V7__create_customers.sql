-- V7: Create customer tables

CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    company_name VARCHAR(255),
    phone VARCHAR(50),
    
    billing_line1 VARCHAR(255),
    billing_line2 VARCHAR(255),
    billing_city VARCHAR(100),
    billing_state VARCHAR(100),
    billing_zip VARCHAR(50),
    billing_country VARCHAR(100),
    
    shipping_line1 VARCHAR(255),
    shipping_line2 VARCHAR(255),
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(100),
    shipping_zip VARCHAR(50),
    shipping_country VARCHAR(100),
    
    vat_number VARCHAR(100),
    tax_exempt BOOLEAN DEFAULT FALSE,
    valid_business_no_vat BOOLEAN DEFAULT FALSE,
    
    preferred_language VARCHAR(50),
    preferred_currency VARCHAR(10) DEFAULT 'USD',
    
    status ENUM('ACTIVE', 'ARCHIVED') NOT NULL DEFAULT 'ACTIVE',
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    INDEX idx_customer_email (email),
    INDEX idx_customer_status (status)
);

CREATE TABLE IF NOT EXISTS customer_payment_methods (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    customer_id VARCHAR(100) NOT NULL,
    type ENUM('CARD', 'BANK_ACCOUNT', 'PAYPAL') NOT NULL,
    status ENUM('VALID', 'EXPIRED', 'FAILED') NOT NULL DEFAULT 'VALID',
    is_primary BOOLEAN DEFAULT FALSE,
    is_backup BOOLEAN DEFAULT FALSE,
    details JSON, -- stores masked card number, expiry, etc.
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_pm_customer (customer_id)
);

CREATE TABLE IF NOT EXISTS customer_contacts (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    customer_id VARCHAR(100) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    tag VARCHAR(100), -- e.g., 'Finance', 'Technical'
    send_account_emails BOOLEAN DEFAULT FALSE,
    send_billing_emails BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_contact_customer (customer_id)
);

CREATE TABLE IF NOT EXISTS customer_custom_field_values (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    customer_id VARCHAR(100) NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    field_value TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_custom_field_unique (customer_id, field_name)
);
