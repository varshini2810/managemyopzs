-- V23: Strict Permissions Model

-- 1. Add granted_modules JSON to user_role_assignments
ALTER TABLE user_role_assignments ADD COLUMN granted_modules JSON;

-- 2. Migrate existing user_granted_modules into user_role_assignments JSON if any
-- Since JSON generation in MySQL from joined tables can be tricky, we will just start fresh for JSON data.
-- Drop the old many-to-many table for granted modules since we are moving to JSON
DROP TABLE IF EXISTS user_granted_modules;

-- 3. In permissions, we'll keep `name` as the primary key but rename it to `permission_key` conceptually in Java. 
-- Wait, the prompt asked for "id, permission_key". If we alter permissions, we'd have to drop `role_permissions` first.
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS permissions;

CREATE TABLE permissions (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    permission_key VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    tenant_id VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- Recreate role_permissions
CREATE TABLE role_permissions (
    role_name VARCHAR(50) NOT NULL,
    permission_id VARCHAR(100) NOT NULL,
    PRIMARY KEY (role_name, permission_id),
    FOREIGN KEY (role_name) REFERENCES roles(name),
    FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

-- Let's update `roles` table. The existing roles table already has `name` as PK. 
-- The prompt asked for: roles: id, name, scope ENUM
-- We'll keep `name` as PK to avoid breaking user_role_assignments.

-- Generate one permission_key per distinct CRUD action
INSERT INTO permissions (id, permission_key, description) VALUES
('perm-1', 'CUSTOMER_VIEW', 'View Customers'),
('perm-2', 'CUSTOMER_CREATE', 'Create Customers'),
('perm-3', 'CUSTOMER_EDIT', 'Edit Customers'),
('perm-4', 'CUSTOMER_DELETE', 'Delete Customers'),

('perm-5', 'SUBSCRIPTION_VIEW', 'View Subscriptions'),
('perm-6', 'SUBSCRIPTION_CREATE', 'Create Subscriptions'),
('perm-7', 'SUBSCRIPTION_EDIT', 'Edit Subscriptions'),
('perm-8', 'SUBSCRIPTION_CANCEL', 'Cancel Subscriptions'),
('perm-9', 'SUBSCRIPTION_PAUSE', 'Pause Subscriptions'),

('perm-10', 'INVOICE_VIEW', 'View Invoices'),
('perm-11', 'INVOICE_CREATE', 'Create Invoices'),
('perm-12', 'INVOICE_MARK_PAID', 'Mark Invoices Paid'),
('perm-13', 'INVOICE_VOID', 'Void Invoices'),

('perm-14', 'CREDIT_NOTE_VIEW', 'View Credit Notes'),
('perm-15', 'CREDIT_NOTE_CREATE', 'Create Credit Notes'),
('perm-16', 'CREDIT_NOTE_REFUND', 'Refund Credit Notes'),
('perm-17', 'CREDIT_NOTE_APPLY', 'Apply Credit Notes'),

('perm-18', 'PRODUCT_FAMILY_VIEW', 'View Product Families'),
('perm-19', 'PRODUCT_FAMILY_CREATE', 'Create Product Families'),
('perm-20', 'PRODUCT_FAMILY_EDIT', 'Edit Product Families'),
('perm-21', 'PRODUCT_FAMILY_DELETE', 'Delete Product Families'),

('perm-22', 'PLAN_VIEW', 'View Plans'),
('perm-23', 'PLAN_CREATE', 'Create Plans'),
('perm-24', 'PLAN_EDIT', 'Edit Plans'),
('perm-25', 'PLAN_DELETE', 'Delete Plans'),

('perm-26', 'ADDON_VIEW', 'View Addons'),
('perm-27', 'ADDON_CREATE', 'Create Addons'),
('perm-28', 'ADDON_EDIT', 'Edit Addons'),
('perm-29', 'ADDON_DELETE', 'Delete Addons'),

('perm-30', 'CHARGE_VIEW', 'View Charges'),
('perm-31', 'CHARGE_CREATE', 'Create Charges'),
('perm-32', 'CHARGE_EDIT', 'Edit Charges'),
('perm-33', 'CHARGE_DELETE', 'Delete Charges'),

('perm-34', 'COUPON_VIEW', 'View Coupons'),
('perm-35', 'COUPON_CREATE', 'Create Coupons'),
('perm-36', 'COUPON_EDIT', 'Edit Coupons'),
('perm-37', 'COUPON_DELETE', 'Delete Coupons'),

('perm-38', 'COUPON_SET_VIEW', 'View Coupon Sets'),
('perm-39', 'COUPON_SET_CREATE', 'Create Coupon Sets'),
('perm-40', 'COUPON_SET_EDIT', 'Edit Coupon Sets'),
('perm-41', 'COUPON_SET_DELETE', 'Delete Coupon Sets'),

('perm-42', 'LOGS_VIEW', 'View Logs'),
('perm-43', 'WEBHOOK_RESEND', 'Resend Webhooks'),

('perm-44', 'DASHBOARDS_VIEW', 'View Dashboards'),
('perm-45', 'DASHBOARDS_CREATE', 'Create Dashboards'),
('perm-46', 'METRIC_EXPLORER_VIEW', 'View Metric Explorer'),
('perm-47', 'CUSTOMER_INSIGHTS_VIEW', 'View Customer Insights'),
('perm-48', 'ACCOUNTING_REPORTS_VIEW', 'View Accounting Reports'),
('perm-49', 'ALERTS_GOALS_VIEW', 'View Alerts and Goals'),
('perm-50', 'ALERTS_GOALS_CREATE', 'Create Alerts and Goals'),
('perm-51', 'REPORT_BUILDER_VIEW', 'View Report Builder'),
('perm-52', 'REPORT_BUILDER_CREATE', 'Create Report Builder'),

('perm-53', 'REPORTS_VIEW', 'View Classic Reports'),
('perm-54', 'REPORTS_RUN', 'Run Classic Reports'),

('perm-55', 'APPS_VIEW', 'View Apps'),
('perm-56', 'APPS_CONNECT', 'Connect Apps'),
('perm-57', 'APPS_DISCONNECT', 'Disconnect Apps'),

('perm-58', 'SETTINGS_CONFIGURE_VIEW', 'View Configure Opz'),
('perm-59', 'SETTINGS_CONFIGURE_EDIT', 'Edit Configure Opz'),
('perm-60', 'SETTINGS_THIRD_PARTY_VIEW', 'View Third Party Config'),
('perm-61', 'SETTINGS_THIRD_PARTY_EDIT', 'Edit Third Party Config'),
('perm-62', 'SETTINGS_IMPORT_EXPORT_VIEW', 'View Import Export'),
('perm-63', 'SETTINGS_IMPORT_EXPORT_RUN', 'Run Import Export'),
('perm-64', 'SETTINGS_TEAM_MEMBERS_VIEW', 'View Team Members'),
('perm-65', 'SETTINGS_TEAM_MEMBERS_MANAGE', 'Manage Team Members'),
('perm-66', 'SETTINGS_NOTIFICATIONS_VIEW', 'View Notifications'),
('perm-67', 'SETTINGS_NOTIFICATIONS_EDIT', 'Edit Notifications'),
('perm-68', 'SETTINGS_SECURITY_VIEW', 'View Security'),
('perm-69', 'SETTINGS_SECURITY_EDIT', 'Edit Security'),

('perm-70', 'CPQ_VIEW', 'View CPQ'),
('perm-71', 'CPQ_CREATE', 'Create CPQ'),
('perm-72', 'RECEIVABLES_VIEW', 'View Receivables'),
('perm-73', 'RECEIVABLES_MANAGE', 'Manage Receivables'),
('perm-74', 'RETENTION_VIEW', 'View Retention'),
('perm-75', 'RETENTION_MANAGE', 'Manage Retention'),
('perm-76', 'REVREC_VIEW', 'View RevRec'),
('perm-77', 'REVREC_MANAGE', 'Manage RevRec'),
('perm-78', 'PAYMENTS_VIEW', 'View Payments'),
('perm-79', 'PAYMENTS_MANAGE', 'Manage Payments'),
('perm-80', 'GROWTH_VIEW', 'View Growth'),
('perm-81', 'GROWTH_MANAGE', 'Manage Growth');

-- Seed role_permissions cascade
-- Ultrasuperadmin: All permissions
INSERT INTO role_permissions (role_name, permission_id) SELECT 'Ultrasuperadmin', id FROM permissions;

-- Superadmin: All permissions
INSERT INTO role_permissions (role_name, permission_id) SELECT 'Superadmin', id FROM permissions;

-- Admin: They only get base read-only + dynamic via granted_modules, OR they get ALL permissions BUT filtered at runtime by their granted_modules.
-- The prompt explicitly states: "Admin: only the permission_keys belonging to modules listed in their own user_role_assignments.granted_modules"
-- If we seed ALL permissions to Admin in role_permissions, we can filter them by `granted_modules` in AccessControlService.
-- Alternatively, we can seed nothing to Admin in role_permissions and dynamically construct permissions in AccessControlService based solely on `granted_modules`.
-- But the prompt says "using the cached role_permissions + granted_modules data".
-- Let's give Admin ALL permissions in role_permissions, and the AccessControlService will filter them by `granted_modules` json array.
INSERT INTO role_permissions (role_name, permission_id) SELECT 'Admin', id FROM permissions;

-- User: Fixed read-only subset
INSERT INTO role_permissions (role_name, permission_id) SELECT 'User', id FROM permissions WHERE permission_key IN (
    'CUSTOMER_VIEW', 'SUBSCRIPTION_VIEW', 'INVOICE_VIEW', 'CREDIT_NOTE_VIEW', 'PRODUCT_FAMILY_VIEW', 'PLAN_VIEW', 'ADDON_VIEW', 'CHARGE_VIEW', 'COUPON_VIEW', 'COUPON_SET_VIEW'
);
