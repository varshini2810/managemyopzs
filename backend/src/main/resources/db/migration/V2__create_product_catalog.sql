-- V2: Product Catalog tables
CREATE TABLE IF NOT EXISTS product_families (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS plans (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    product_family_id VARCHAR(100),
    internal_name VARCHAR(255) NOT NULL,
    description TEXT,
    display_self_serve BOOLEAN DEFAULT FALSE,
    display_checkout BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'archived') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (product_family_id) REFERENCES product_families(id)
);

CREATE TABLE IF NOT EXISTS plan_price_points (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    plan_id VARCHAR(100) NOT NULL,
    external_name VARCHAR(255) NOT NULL,
    internal_name VARCHAR(255) NOT NULL,
    pricing_model ENUM('flat_fee','per_unit','tiered','volume','stairstep','usage_based') NOT NULL DEFAULT 'flat_fee',
    price DECIMAL(15,4) NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    billing_cycle ENUM('monthly','quarterly','semi_annual','annual','custom') NOT NULL DEFAULT 'monthly',
    has_trial BOOLEAN DEFAULT FALSE,
    trial_period_days INT DEFAULT 0,
    display_self_serve BOOLEAN DEFAULT FALSE,
    display_checkout BOOLEAN DEFAULT FALSE,
    status ENUM('active','archived') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (plan_id) REFERENCES plans(id)
);

CREATE TABLE IF NOT EXISTS addons (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    product_family_id VARCHAR(100),
    pricing_model ENUM('flat_fee','per_unit','tiered','volume','stairstep','usage_based') NOT NULL DEFAULT 'flat_fee',
    price DECIMAL(15,4) NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    charge_type ENUM('recurring','one_time') NOT NULL DEFAULT 'recurring',
    display_self_serve BOOLEAN DEFAULT FALSE,
    display_checkout BOOLEAN DEFAULT FALSE,
    status ENUM('active','archived') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (product_family_id) REFERENCES product_families(id)
);

CREATE TABLE IF NOT EXISTS charges (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15,4) NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    taxable BOOLEAN DEFAULT FALSE,
    status ENUM('active','archived') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
