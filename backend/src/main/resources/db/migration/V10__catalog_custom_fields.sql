-- V10: Custom Fields values for Product Catalog

-- Add 'addon' and 'charge' to custom_fields entity_type enum
ALTER TABLE custom_fields 
MODIFY COLUMN entity_type ENUM('customer','subscription','invoice','plan','addon','charge') NOT NULL;

CREATE TABLE IF NOT EXISTS plan_custom_field_values (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    plan_id VARCHAR(100) NOT NULL,
    field_id VARCHAR(100) NOT NULL,
    field_value TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
    FOREIGN KEY (field_id) REFERENCES custom_fields(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_plan_field (plan_id, field_id)
);

CREATE TABLE IF NOT EXISTS addon_custom_field_values (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    addon_id VARCHAR(100) NOT NULL,
    field_id VARCHAR(100) NOT NULL,
    field_value TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (addon_id) REFERENCES addons(id) ON DELETE CASCADE,
    FOREIGN KEY (field_id) REFERENCES custom_fields(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_addon_field (addon_id, field_id)
);

CREATE TABLE IF NOT EXISTS charge_custom_field_values (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    charge_id VARCHAR(100) NOT NULL,
    field_id VARCHAR(100) NOT NULL,
    field_value TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (charge_id) REFERENCES charges(id) ON DELETE CASCADE,
    FOREIGN KEY (field_id) REFERENCES custom_fields(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_charge_field (charge_id, field_id)
);
