-- V29: Create brand settings table
CREATE TABLE IF NOT EXISTS brand_settings (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    logo_url VARCHAR(500) NULL,
    icon_url VARCHAR(500) NULL,
    favicon_url VARCHAR(500) NULL,
    accent_color VARCHAR(50) NOT NULL DEFAULT '#2196F3',
    email_branding BOOLEAN NOT NULL DEFAULT TRUE,
    invoice_branding BOOLEAN NOT NULL DEFAULT TRUE,
    checkout_branding BOOLEAN NOT NULL DEFAULT TRUE,
    portal_branding BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed default brand settings
INSERT IGNORE INTO brand_settings (id, accent_color, email_branding, invoice_branding, checkout_branding, portal_branding)
VALUES ('default', '#2196F3', TRUE, TRUE, TRUE, TRUE);
