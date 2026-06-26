-- Migrate existing users from 'Tenant Admin' and 'Tenant User' to 'Admin' and 'User'
UPDATE user_role_assignments SET role_name = 'Admin' WHERE role_name = 'Tenant Admin';
UPDATE user_role_assignments SET role_name = 'User' WHERE role_name = 'Tenant User';

-- Create role_permissions if not exists to prevent fresh install failures
CREATE TABLE IF NOT EXISTS role_permissions (
    role_name VARCHAR(50) NOT NULL,
    permission_id VARCHAR(100) NOT NULL
);

-- Delete the old tenant roles from role_permissions and roles tables
DELETE FROM role_permissions WHERE role_name IN ('Tenant Admin', 'Tenant User');
DELETE FROM roles WHERE name IN ('Tenant Admin', 'Tenant User');

-- Update the scopes of the remaining roles to match the new hierarchy
UPDATE roles SET scope = 'platform', description = 'Platform owner, sees everything' WHERE name = 'Ultrasuperadmin';
UPDATE roles SET scope = 'tenant', description = 'Full access within a client tenant' WHERE name = 'Superadmin';
UPDATE roles SET scope = 'tenant', description = 'Scoped to specific modules within a tenant' WHERE name = 'Admin';
UPDATE roles SET scope = 'tenant', description = 'Read-only or self-serve access' WHERE name = 'User';
