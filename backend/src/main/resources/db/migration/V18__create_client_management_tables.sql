-- V18: Create Client Management Tables for Ultrasuperadmin

-- 1. access_presets table
CREATE TABLE access_presets (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    preset_name VARCHAR(150) NOT NULL,
    description TEXT,
    module_keys JSON NOT NULL, -- Array of strings e.g. ["billing:home", "cpq:quotes"]
    created_by VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed an initial preset
INSERT INTO access_presets (id, preset_name, description, module_keys) VALUES
('preset-billing-only', 'Billing Only', 'Grants full access to the Chargebee Billing suite.', '["billing:home", "billing:customers", "billing:subscriptions", "billing:invoices", "billing:catalog", "billing:logs", "billing:revenue-story", "billing:classic-reports", "billing:apps", "billing:settings"]'),
('preset-full-platform', 'Full Platform Access', 'Grants access to all suites and modules.', '["billing:home", "billing:customers", "billing:subscriptions", "billing:invoices", "billing:catalog", "billing:logs", "billing:revenue-story", "billing:classic-reports", "billing:apps", "billing:settings", "cpq:quotes", "cpq:settings", "receivables:dashboard", "receivables:collections", "receivables:reconciliation", "receivables:disputes", "receivables:write-off", "retention:cancel-flows", "retention:churn-reasons", "retention:winback", "retention:at-risk", "retention:activity-log", "revrec:schedules", "revrec:waterfall", "revrec:obligations", "revrec:modifications", "revrec:journal-entries", "revrec:audit-trail", "payments:transactions", "payments:sources", "payments:refunds", "payments:gateway-health", "payments:payouts", "growth:pricing-experiments", "growth:checkout-optimization", "growth:upsell-rules", "growth:referrals"]');


-- 2. tenant_module_access table
CREATE TABLE tenant_module_access (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    tenant_id VARCHAR(100) NOT NULL,
    suite_key VARCHAR(50) NOT NULL,
    module_key VARCHAR(50) NOT NULL,
    granted BOOLEAN NOT NULL DEFAULT TRUE,
    granted_by VARCHAR(100),
    granted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX idx_tenant_module_access_lookup ON tenant_module_access (tenant_id, suite_key, module_key);
