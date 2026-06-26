-- Insert platform tenant to support referential integrity constraints for platform-wide records
INSERT INTO tenants (id, name, domain, status, is_suspended)
VALUES ('PLATFORM', 'Platform Tenant', 'platform', 'active', FALSE)
ON DUPLICATE KEY UPDATE name = 'Platform Tenant';
