-- V1: Create users table and seed admin user
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(500) NOT NULL,
    role ENUM('ADMIN', 'BILLING_MANAGER', 'SUPPORT', 'READ_ONLY') NOT NULL DEFAULT 'READ_ONLY',
    status ENUM('ACTIVE', 'INACTIVE', 'INVITED') NOT NULL DEFAULT 'ACTIVE',
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Seed admin user: admin@billing.com / Admin@123
-- Password hash generated with BCrypt strength 10
INSERT INTO users (id, name, email, password_hash, role, status) VALUES
('usr-admin-001', 'Admin User', 'admin@billing.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', 'ACTIVE'),
('usr-mgr-001', 'Billing Manager', 'billing@billing.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'BILLING_MANAGER', 'ACTIVE'),
('usr-sup-001', 'Support User', 'support@billing.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'SUPPORT', 'ACTIVE');

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    action ENUM('CREATE', 'UPDATE', 'DELETE', 'VIEW') NOT NULL,
    changed_by VARCHAR(255),
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    old_value JSON,
    new_value JSON,
    ip_address VARCHAR(45),
    INDEX idx_audit_entity (entity_type, entity_id),
    INDEX idx_audit_changed_at (changed_at)
);
