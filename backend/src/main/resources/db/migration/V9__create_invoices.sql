-- V9: Create invoices and credit notes tables

CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    customer_id VARCHAR(100) NOT NULL,
    subscription_id VARCHAR(100), -- Nullable if it's a one-off invoice
    
    status ENUM('DRAFT', 'POSTED', 'PAYMENT_DUE', 'PAID', 'NOT_PAID', 'VOIDED') NOT NULL DEFAULT 'DRAFT',
    
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    subtotal DECIMAL(15,4) NOT NULL DEFAULT 0,
    tax_total DECIMAL(15,4) NOT NULL DEFAULT 0,
    total DECIMAL(15,4) NOT NULL DEFAULT 0,
    amount_paid DECIMAL(15,4) NOT NULL DEFAULT 0,
    amount_due DECIMAL(15,4) NOT NULL DEFAULT 0,
    
    invoice_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NULL,
    paid_at TIMESTAMP NULL,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    -- We won't strictly enforce subscription_id FK here just in case of one-off invoices, 
    -- but usually it would reference subscriptions(id).
    
    INDEX idx_invoice_customer (customer_id),
    INDEX idx_invoice_status (status)
);

CREATE TABLE IF NOT EXISTS invoice_line_items (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    invoice_id VARCHAR(100) NOT NULL,
    
    description VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_amount DECIMAL(15,4) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(15,4) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(15,4) NOT NULL DEFAULT 0,
    amount DECIMAL(15,4) NOT NULL DEFAULT 0,
    
    entity_type VARCHAR(50), -- e.g., 'PLAN', 'ADDON', 'CHARGE'
    entity_id VARCHAR(100),
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS credit_notes (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    customer_id VARCHAR(100) NOT NULL,
    invoice_id VARCHAR(100), -- Can be tied to a specific invoice
    
    type ENUM('ADJUSTMENT', 'REFUNDABLE', 'STORE_CREDIT') NOT NULL DEFAULT 'ADJUSTMENT',
    status ENUM('DRAFT', 'OPEN', 'CONSUMED', 'VOIDED') NOT NULL DEFAULT 'DRAFT',
    
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    total DECIMAL(15,4) NOT NULL DEFAULT 0,
    allocated_amount DECIMAL(15,4) NOT NULL DEFAULT 0,
    available_amount DECIMAL(15,4) NOT NULL DEFAULT 0,
    
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (invoice_id) REFERENCES invoices(id),
    
    INDEX idx_credit_note_customer (customer_id),
    INDEX idx_credit_note_status (status)
);

CREATE TABLE IF NOT EXISTS credit_note_line_items (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    credit_note_id VARCHAR(100) NOT NULL,
    
    description VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_amount DECIMAL(15,4) NOT NULL DEFAULT 0,
    amount DECIMAL(15,4) NOT NULL DEFAULT 0,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (credit_note_id) REFERENCES credit_notes(id) ON DELETE CASCADE
);
