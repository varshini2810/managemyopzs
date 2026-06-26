-- Modify created_at column to NOT NULL to match MappedSuperclass BaseEntity expectation
ALTER TABLE revenue_customer_segments MODIFY created_at TIMESTAMP NOT NULL;
ALTER TABLE revenue_report_schedules MODIFY created_at TIMESTAMP NOT NULL;
ALTER TABLE revenue_alerts MODIFY created_at TIMESTAMP NOT NULL;
ALTER TABLE revenue_goals MODIFY created_at TIMESTAMP NOT NULL;
ALTER TABLE revenue_saved_reports MODIFY created_at TIMESTAMP NOT NULL;
ALTER TABLE security_ip_allowlist MODIFY created_at TIMESTAMP NOT NULL;
ALTER TABLE opz_notifications MODIFY created_at TIMESTAMP NOT NULL;
