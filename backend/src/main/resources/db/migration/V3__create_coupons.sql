-- V3: Coupons and Coupon Sets
CREATE TABLE IF NOT EXISTS coupons (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    invoice_name VARCHAR(255),
    discount_type ENUM('percentage','fixed_amount') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL DEFAULT 0,
    apply_on ENUM('invoice_amount','each_specified_item') NOT NULL DEFAULT 'invoice_amount',
    applicable_item_ids JSON,
    duration_type ENUM('one_time','forever','limited_period') NOT NULL DEFAULT 'one_time',
    duration_value INT DEFAULT NULL,
    duration_unit ENUM('days','months') DEFAULT NULL,
    valid_till TIMESTAMP NULL,
    max_redemptions INT NULL,
    current_redemptions INT NOT NULL DEFAULT 0,
    status ENUM('active','expired','archived') NOT NULL DEFAULT 'active',
    metadata JSON,
    invoice_note TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS coupon_sets (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    discount_type ENUM('percentage','fixed_amount') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_codes INT NOT NULL DEFAULT 0,
    used_codes INT NOT NULL DEFAULT 0,
    status ENUM('active','archived') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS coupon_codes (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    coupon_set_id VARCHAR(100) NOT NULL,
    code VARCHAR(255) NOT NULL UNIQUE,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    used_at TIMESTAMP NULL,
    used_by VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coupon_set_id) REFERENCES coupon_sets(id)
);

CREATE TABLE IF NOT EXISTS coupon_events (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    coupon_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    description TEXT,
    performed_by VARCHAR(255),
    occurred_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metadata JSON,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id)
);
