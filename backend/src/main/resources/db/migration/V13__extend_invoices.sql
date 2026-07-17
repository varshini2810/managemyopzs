-- Extending invoices table
ALTER TABLE invoices
ADD COLUMN gst_number VARCHAR(20),
ADD COLUMN customer_phone VARCHAR(20),
ADD COLUMN tax_percentage DECIMAL(5,2),
ADD COLUMN payment_status VARCHAR(20) DEFAULT 'sent';

-- Extending invoice_line_items table
ALTER TABLE invoice_line_items
ADD COLUMN item_type VARCHAR(20),
ADD COLUMN hsn_sac_code VARCHAR(50),
ADD COLUMN item_gst_percentage DECIMAL(5,2);

-- Extending credit_notes table
ALTER TABLE credit_notes
ADD COLUMN expense_type VARCHAR(50),
ADD COLUMN custom_expense_label VARCHAR(100),
ADD COLUMN expense_cost DECIMAL(15,4);

-- Feature 1: Invoice Number Sequence
CREATE TABLE invoice_number_sequences (
    tenant_id VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    last_sequence INT NOT NULL DEFAULT 0,
    PRIMARY KEY (tenant_id, year)
);

-- Feature 3: HSN/SAC Cache
CREATE TABLE hsn_sac_cache (
    id VARCHAR(100) PRIMARY KEY,
    query_text VARCHAR(255) NOT NULL,
    hsn_or_sac_code VARCHAR(50),
    description TEXT,
    gst_rate DECIMAL(5,2),
    cached_at DATETIME NOT NULL,
    tenant_id VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME
);
CREATE INDEX idx_hsn_sac_query ON hsn_sac_cache (query_text, tenant_id);

-- Feature 6: Invoice Notifications
CREATE TABLE invoice_notifications (
    id VARCHAR(100) PRIMARY KEY,
    invoice_id VARCHAR(100) NOT NULL,
    channel VARCHAR(20) NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    scheduled_for DATETIME NOT NULL,
    sent_at DATETIME,
    status VARCHAR(20) NOT NULL,
    tenant_id VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    deleted_at DATETIME,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);
CREATE INDEX idx_invoice_notifications_pending ON invoice_notifications (status, scheduled_for);
