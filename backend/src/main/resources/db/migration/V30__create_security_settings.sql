CREATE TABLE security_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL UNIQUE,
    min_length INT DEFAULT 12,
    complexity VARCHAR(255) DEFAULT 'Require Numbers & Symbols',
    mfa_enabled BOOLEAN DEFAULT FALSE,
    session_timeout INT DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);
