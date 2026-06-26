-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    status ENUM('active','suspended','trial') NOT NULL DEFAULT 'trial',
    is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    name VARCHAR(50) NOT NULL PRIMARY KEY,
    description VARCHAR(255),
    scope ENUM('platform', 'tenant') NOT NULL DEFAULT 'platform',
    tenant_id VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- In case roles was already created by JPA, try to add the column (this might fail if syntax is strict, but MySQL allows ADD COLUMN IF NOT EXISTS in newer versions, or we just rely on the CREATE TABLE IF NOT EXISTS if it's a fresh DB).
-- To be safe across MariaDB/MySQL versions without IF NOT EXISTS on columns:
-- If roles table was created by JPA previously, it would not have the scope column. 
-- Assuming fresh DB for Flyway since we're using Flyway now.

-- Alter users table
ALTER TABLE users ADD COLUMN tenant_id VARCHAR(100);
ALTER TABLE users ADD CONSTRAINT fk_users_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id);
-- Drop old role column if it exists
-- MySQL doesn't support DROP COLUMN IF EXISTS directly without a procedure, so we assume it exists from V1.
ALTER TABLE users DROP COLUMN role;

-- Create user_role_assignments table
CREATE TABLE IF NOT EXISTS user_role_assignments (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    role_name VARCHAR(50) NOT NULL,
    tenant_id VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_name) REFERENCES roles(name),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);
