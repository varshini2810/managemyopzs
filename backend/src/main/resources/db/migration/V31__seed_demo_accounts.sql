INSERT INTO users (id, name, email, password_hash, status) VALUES
('usr-demo-admin', 'Demo Admin', 'admin@billingplatform.com', '$2a$10$r7DSZN6H.NGDCWEpdnCo2e0e1IaKS0iMUbDuhyn5JRZvD8U9A3V8S', 'ACTIVE'),
('usr-demo-super', 'Demo Super Admin', 'superadmin@billingplatform.com', '$2a$10$4P7.01H4nmuOnoWOOulz7.bT1wxjbhjEuOcN2d6ddGjl2VjkrH0Km', 'ACTIVE'),
('usr-demo-ultra', 'Demo Ultra Admin', 'ultraadmin@billingplatform.com', '$2a$10$SkOOUtkxD4mGiiHqkraLju.SE5uPbQaeDtGUYguZ1f8Z/8oChdr4G', 'ACTIVE'),
('usr-demo-user', 'Demo User', 'user@billingplatform.com', '$2a$10$qZb7Cp.sb7uZADXaylnRE.8vYHN65orLZXEAatb0EZyyg.0cgEFzy', 'ACTIVE')
ON DUPLICATE KEY UPDATE 
    name = VALUES(name), 
    password_hash = VALUES(password_hash), 
    status = VALUES(status);

-- We need to assign roles to them.
-- UserRoleAssignment needs an ID, user_id, role_name, tenant_id.
-- Let's assign Platform roles for simplicity.

INSERT INTO user_role_assignments (id, user_id, role_name, tenant_id) VALUES
('ura-demo-admin', 'usr-demo-admin', 'Admin', NULL),
('ura-demo-super', 'usr-demo-super', 'Superadmin', NULL),
('ura-demo-ultra', 'usr-demo-ultra', 'Ultrasuperadmin', NULL),
('ura-demo-user', 'usr-demo-user', 'User', NULL)
ON DUPLICATE KEY UPDATE 
    role_name = VALUES(role_name);
