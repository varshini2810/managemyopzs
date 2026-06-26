-- V8: Create subscription tables

CREATE TABLE IF NOT EXISTS subscriptions (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    customer_id VARCHAR(100) NOT NULL,
    plan_id VARCHAR(100) NOT NULL,
    price_point_id VARCHAR(100) NOT NULL,
    
    status ENUM('FUTURE', 'IN_TRIAL', 'ACTIVE', 'NON_RENEWING', 'PAUSED', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    
    current_term_start TIMESTAMP NULL,
    current_term_end TIMESTAMP NULL,
    next_billing_at TIMESTAMP NULL,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (plan_id) REFERENCES plans(id),
    FOREIGN KEY (price_point_id) REFERENCES plan_price_points(id),
    
    INDEX idx_sub_customer (customer_id),
    INDEX idx_sub_status (status)
);

CREATE TABLE IF NOT EXISTS subscription_addons (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    subscription_id VARCHAR(100) NOT NULL,
    addon_id VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(15,4) NOT NULL DEFAULT 0,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
    FOREIGN KEY (addon_id) REFERENCES addons(id)
);

CREATE TABLE IF NOT EXISTS subscription_events (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    subscription_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(100) NOT NULL, -- e.g., 'CREATED', 'PLAN_CHANGED', 'RENEWED', 'PAUSED', 'CANCELLED'
    event_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    details JSON,
    
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
    INDEX idx_sub_events (subscription_id, event_date)
);
