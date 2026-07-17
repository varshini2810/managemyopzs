-- V6: Revenue Story and New Settings Tables

CREATE TABLE revenue_customer_segments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    rules_json TEXT NOT NULL,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE revenue_report_schedules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_type VARCHAR(100) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    recipients TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE revenue_alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    metric VARCHAR(100) NOT NULL,
    alert_condition VARCHAR(255) NOT NULL,
    notification_method VARCHAR(50) NOT NULL,
    recipients TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    last_triggered TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE revenue_goals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    target_metric VARCHAR(100) NOT NULL,
    target_value DECIMAL(19, 4) NOT NULL,
    start_date DATE,
    deadline DATE,
    tracking_frequency VARCHAR(50),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE revenue_saved_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    data_source VARCHAR(100) NOT NULL,
    fields_json TEXT,
    filters_json TEXT,
    aggregation_json TEXT,
    visibility VARCHAR(50) DEFAULT 'PRIVATE',
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE opz_notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'ENABLED',
    recipients TEXT,
    template_subject VARCHAR(255),
    template_body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE security_ip_allowlist (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ip_range VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Seed some default notifications
INSERT INTO opz_notifications (type, channel, status, recipients, template_subject, template_body) VALUES
('Payment Failed', 'Email', 'ENABLED', 'admin@example.com', 'Payment Failed for {{customer_name}}', 'A payment of {{invoice_amount}} failed.'),
('Subscription Renewed', 'Email', 'ENABLED', 'billing@example.com', 'Subscription Renewed', 'A subscription renewed successfully.'),
('Invoice Generated', 'Email', 'ENABLED', 'admin@example.com', 'New Invoice', 'Invoice generated for {{customer_name}}.'),
('Dunning Triggered', 'Email', 'ENABLED', 'admin@example.com', 'Dunning Flow Started', 'Dunning started for customer.');
