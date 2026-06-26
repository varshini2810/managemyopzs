-- Seed exactly 6 core roles

INSERT INTO roles (name, description, scope) VALUES
('Ultrasuperadmin', 'Platform Ultrasuperadmin with full access', 'platform'),
('Superadmin', 'Platform Superadmin with mostly full access', 'platform'),
('Admin', 'Platform Admin', 'platform'),
('User', 'Platform User', 'platform'),
('Tenant Admin', 'Admin for a specific tenant', 'tenant'),
('Tenant User', 'User for a specific tenant', 'tenant')
ON DUPLICATE KEY UPDATE scope = VALUES(scope), description = VALUES(description);
