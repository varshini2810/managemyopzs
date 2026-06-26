-- V21: Add missing columns to existing tables dynamically

DROP PROCEDURE IF EXISTS AddColumnSafely;
DELIMITER //
CREATE PROCEDURE AddColumnSafely(IN tableName VARCHAR(255), IN colName VARCHAR(255), IN colType VARCHAR(255))
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = tableName
        AND COLUMN_NAME = colName
    ) THEN
        SET @s = CONCAT('ALTER TABLE ', tableName, ' ADD COLUMN ', colName, ' ', colType);
        PREPARE stmt FROM @s;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END //
DELIMITER ;

-- Table: tenants
CALL AddColumnSafely('tenants', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('tenants', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('tenants', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('tenants', 'updated_by', 'VARCHAR(100) NULL');

-- Table: users
CALL AddColumnSafely('users', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('users', 'updated_by', 'VARCHAR(100) NULL');

-- Table: coupons
CALL AddColumnSafely('coupons', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('coupons', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('coupons', 'updated_by', 'VARCHAR(100) NULL');

-- Table: quotes
CALL AddColumnSafely('quotes', 'id', 'VARCHAR(100) NOT NULL');
CALL AddColumnSafely('quotes', 'created_at', 'DATETIME(6) NOT NULL');
CALL AddColumnSafely('quotes', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('quotes', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('quotes', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('quotes', 'updated_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('quotes', 'updated_by', 'VARCHAR(100) NULL');

-- Table: quote_approvals
CALL AddColumnSafely('quote_approvals', 'id', 'VARCHAR(100) NOT NULL');
CALL AddColumnSafely('quote_approvals', 'created_at', 'DATETIME(6) NOT NULL');
CALL AddColumnSafely('quote_approvals', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('quote_approvals', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('quote_approvals', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('quote_approvals', 'updated_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('quote_approvals', 'updated_by', 'VARCHAR(100) NULL');

-- Table: quote_line_items
CALL AddColumnSafely('quote_line_items', 'id', 'VARCHAR(100) NOT NULL');
CALL AddColumnSafely('quote_line_items', 'created_at', 'DATETIME(6) NOT NULL');
CALL AddColumnSafely('quote_line_items', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('quote_line_items', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('quote_line_items', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('quote_line_items', 'updated_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('quote_line_items', 'updated_by', 'VARCHAR(100) NULL');

-- Table: customer_contacts
CALL AddColumnSafely('customer_contacts', 'deleted_at', 'DATETIME(6) NULL');

-- Table: customer_custom_field_values
CALL AddColumnSafely('customer_custom_field_values', 'deleted_at', 'DATETIME(6) NULL');

-- Table: customer_payment_methods
CALL AddColumnSafely('customer_payment_methods', 'deleted_at', 'DATETIME(6) NULL');

-- Table: checkout_funnel_events
CALL AddColumnSafely('checkout_funnel_events', 'id', 'VARCHAR(100) NOT NULL');
CALL AddColumnSafely('checkout_funnel_events', 'created_at', 'DATETIME(6) NOT NULL');
CALL AddColumnSafely('checkout_funnel_events', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('checkout_funnel_events', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('checkout_funnel_events', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('checkout_funnel_events', 'updated_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('checkout_funnel_events', 'updated_by', 'VARCHAR(100) NULL');

-- Table: pricing_experiments
CALL AddColumnSafely('pricing_experiments', 'id', 'VARCHAR(100) NOT NULL');
CALL AddColumnSafely('pricing_experiments', 'created_at', 'DATETIME(6) NOT NULL');
CALL AddColumnSafely('pricing_experiments', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('pricing_experiments', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('pricing_experiments', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('pricing_experiments', 'updated_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('pricing_experiments', 'updated_by', 'VARCHAR(100) NULL');

-- Table: referral_programs
CALL AddColumnSafely('referral_programs', 'id', 'VARCHAR(100) NOT NULL');
CALL AddColumnSafely('referral_programs', 'created_at', 'DATETIME(6) NOT NULL');
CALL AddColumnSafely('referral_programs', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('referral_programs', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('referral_programs', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('referral_programs', 'updated_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('referral_programs', 'updated_by', 'VARCHAR(100) NULL');

-- Table: upsell_rules
CALL AddColumnSafely('upsell_rules', 'id', 'VARCHAR(100) NOT NULL');
CALL AddColumnSafely('upsell_rules', 'created_at', 'DATETIME(6) NOT NULL');
CALL AddColumnSafely('upsell_rules', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('upsell_rules', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('upsell_rules', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('upsell_rules', 'updated_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('upsell_rules', 'updated_by', 'VARCHAR(100) NULL');

-- Table: credit_notes
CALL AddColumnSafely('credit_notes', 'custom_expense_label', 'VARCHAR(100) NULL');
CALL AddColumnSafely('credit_notes', 'expense_cost', 'DECIMAL(15,4) NULL');
CALL AddColumnSafely('credit_notes', 'credit_note_number', 'VARCHAR(100) NULL');

-- Table: credit_note_line_items
CALL AddColumnSafely('credit_note_line_items', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('credit_note_line_items', 'updated_at', 'DATETIME(6) NULL');

-- Table: hsn_sac_cache
CALL AddColumnSafely('hsn_sac_cache', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('hsn_sac_cache', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('hsn_sac_cache', 'updated_by', 'VARCHAR(100) NULL');

-- Table: invoices
CALL AddColumnSafely('invoices', 'customer_phone', 'VARCHAR(20) NULL');
CALL AddColumnSafely('invoices', 'tax_percentage', 'DECIMAL(5,2) NULL');
CALL AddColumnSafely('invoices', 'payment_status', 'ENUM(\'SENT\', \'PAID\', \'OVERDUE\') NULL');

-- Table: invoice_line_items
CALL AddColumnSafely('invoice_line_items', 'hsn_sac_code', 'VARCHAR(50) NULL');
CALL AddColumnSafely('invoice_line_items', 'item_gst_percentage', 'DECIMAL(5,2) NULL');
CALL AddColumnSafely('invoice_line_items', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('invoice_line_items', 'updated_at', 'DATETIME(6) NULL');

-- Table: invoice_notifications
CALL AddColumnSafely('invoice_notifications', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('invoice_notifications', 'updated_by', 'VARCHAR(100) NULL');

-- Table: gateway_health_logs
CALL AddColumnSafely('gateway_health_logs', 'id', 'VARCHAR(100) NOT NULL');
CALL AddColumnSafely('gateway_health_logs', 'created_at', 'DATETIME(6) NOT NULL');
CALL AddColumnSafely('gateway_health_logs', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('gateway_health_logs', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('gateway_health_logs', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('gateway_health_logs', 'updated_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('gateway_health_logs', 'updated_by', 'VARCHAR(100) NULL');

-- Table: payment_sources
CALL AddColumnSafely('payment_sources', 'id', 'VARCHAR(100) NOT NULL');
CALL AddColumnSafely('payment_sources', 'created_at', 'DATETIME(6) NOT NULL');
CALL AddColumnSafely('payment_sources', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('payment_sources', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('payment_sources', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('payment_sources', 'updated_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('payment_sources', 'updated_by', 'VARCHAR(100) NULL');

-- Table: payment_transactions
CALL AddColumnSafely('payment_transactions', 'id', 'VARCHAR(100) NOT NULL');
CALL AddColumnSafely('payment_transactions', 'created_at', 'DATETIME(6) NOT NULL');
CALL AddColumnSafely('payment_transactions', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('payment_transactions', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('payment_transactions', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('payment_transactions', 'updated_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('payment_transactions', 'updated_by', 'VARCHAR(100) NULL');

-- Table: payouts
CALL AddColumnSafely('payouts', 'id', 'VARCHAR(100) NOT NULL');
CALL AddColumnSafely('payouts', 'created_at', 'DATETIME(6) NOT NULL');
CALL AddColumnSafely('payouts', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('payouts', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('payouts', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('payouts', 'updated_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('payouts', 'updated_by', 'VARCHAR(100) NULL');

-- Table: refunds
CALL AddColumnSafely('refunds', 'id', 'VARCHAR(100) NOT NULL');
CALL AddColumnSafely('refunds', 'created_at', 'DATETIME(6) NOT NULL');
CALL AddColumnSafely('refunds', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('refunds', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('refunds', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('refunds', 'updated_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('refunds', 'updated_by', 'VARCHAR(100) NULL');

-- Table: addons
CALL AddColumnSafely('addons', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('addons', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('addons', 'updated_by', 'VARCHAR(100) NULL');

-- Table: charges
CALL AddColumnSafely('charges', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('charges', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('charges', 'updated_by', 'VARCHAR(100) NULL');

-- Table: plans
CALL AddColumnSafely('plans', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('plans', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('plans', 'updated_by', 'VARCHAR(100) NULL');

-- Table: plan_price_points
CALL AddColumnSafely('plan_price_points', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('plan_price_points', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('plan_price_points', 'updated_by', 'VARCHAR(100) NULL');

-- Table: product_families
CALL AddColumnSafely('product_families', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('product_families', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('product_families', 'updated_by', 'VARCHAR(100) NULL');

-- Table: a_r_collections_queues
CALL AddColumnSafely('a_r_collections_queues', 'id', 'VARCHAR(100) NOT NULL');
CALL AddColumnSafely('a_r_collections_queues', 'created_at', 'DATETIME(6) NOT NULL');
CALL AddColumnSafely('a_r_collections_queues', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('a_r_collections_queues', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('a_r_collections_queues', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('a_r_collections_queues', 'updated_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('a_r_collections_queues', 'updated_by', 'VARCHAR(100) NULL');

-- Table: disputes
CALL AddColumnSafely('disputes', 'id', 'VARCHAR(100) NOT NULL');
CALL AddColumnSafely('disputes', 'created_at', 'DATETIME(6) NOT NULL');
CALL AddColumnSafely('disputes', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('disputes', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('disputes', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('disputes', 'updated_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('disputes', 'updated_by', 'VARCHAR(100) NULL');

-- Table: payment_reconciliations
CALL AddColumnSafely('payment_reconciliations', 'id', 'VARCHAR(100) NOT NULL');
CALL AddColumnSafely('payment_reconciliations', 'created_at', 'DATETIME(6) NOT NULL');
CALL AddColumnSafely('payment_reconciliations', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('payment_reconciliations', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('payment_reconciliations', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('payment_reconciliations', 'updated_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('payment_reconciliations', 'updated_by', 'VARCHAR(100) NULL');

-- Table: write_offs
CALL AddColumnSafely('write_offs', 'id', 'VARCHAR(100) NOT NULL');
CALL AddColumnSafely('write_offs', 'created_at', 'DATETIME(6) NOT NULL');
CALL AddColumnSafely('write_offs', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('write_offs', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('write_offs', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('write_offs', 'updated_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('write_offs', 'updated_by', 'VARCHAR(100) NULL');

-- Table: at_risk_signals
CALL AddColumnSafely('at_risk_signals', 'id', 'VARCHAR(100) NOT NULL');
CALL AddColumnSafely('at_risk_signals', 'created_at', 'DATETIME(6) NOT NULL');
CALL AddColumnSafely('at_risk_signals', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('at_risk_signals', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('at_risk_signals', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('at_risk_signals', 'updated_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('at_risk_signals', 'updated_by', 'VARCHAR(100) NULL');

-- Table: cancel_flow_configs
CALL AddColumnSafely('cancel_flow_configs', 'id', 'VARCHAR(100) NOT NULL');
CALL AddColumnSafely('cancel_flow_configs', 'created_at', 'DATETIME(6) NOT NULL');
CALL AddColumnSafely('cancel_flow_configs', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('cancel_flow_configs', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('cancel_flow_configs', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('cancel_flow_configs', 'updated_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('cancel_flow_configs', 'updated_by', 'VARCHAR(100) NULL');

-- Table: churn_reasons
CALL AddColumnSafely('churn_reasons', 'id', 'VARCHAR(100) NOT NULL');
CALL AddColumnSafely('churn_reasons', 'created_at', 'DATETIME(6) NOT NULL');
CALL AddColumnSafely('churn_reasons', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('churn_reasons', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('churn_reasons', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('churn_reasons', 'updated_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('churn_reasons', 'updated_by', 'VARCHAR(100) NULL');

-- Table: retention_activity_logs
CALL AddColumnSafely('retention_activity_logs', 'id', 'VARCHAR(100) NOT NULL');
CALL AddColumnSafely('retention_activity_logs', 'created_at', 'DATETIME(6) NOT NULL');
CALL AddColumnSafely('retention_activity_logs', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('retention_activity_logs', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('retention_activity_logs', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('retention_activity_logs', 'updated_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('retention_activity_logs', 'updated_by', 'VARCHAR(100) NULL');

-- Table: winback_campaigns
CALL AddColumnSafely('winback_campaigns', 'id', 'VARCHAR(100) NOT NULL');
CALL AddColumnSafely('winback_campaigns', 'created_at', 'DATETIME(6) NOT NULL');
CALL AddColumnSafely('winback_campaigns', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('winback_campaigns', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('winback_campaigns', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('winback_campaigns', 'updated_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('winback_campaigns', 'updated_by', 'VARCHAR(100) NULL');

-- Table: revenue_customer_segments
CALL AddColumnSafely('revenue_customer_segments', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('revenue_customer_segments', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('revenue_customer_segments', 'updated_by', 'VARCHAR(100) NULL');

-- Table: revenue_report_schedules
CALL AddColumnSafely('revenue_report_schedules', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('revenue_report_schedules', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('revenue_report_schedules', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('revenue_report_schedules', 'updated_by', 'VARCHAR(100) NULL');

-- Table: revenue_alerts
CALL AddColumnSafely('revenue_alerts', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('revenue_alerts', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('revenue_alerts', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('revenue_alerts', 'updated_by', 'VARCHAR(100) NULL');

-- Table: revenue_goals
CALL AddColumnSafely('revenue_goals', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('revenue_goals', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('revenue_goals', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('revenue_goals', 'updated_by', 'VARCHAR(100) NULL');

-- Table: revenue_saved_reports
CALL AddColumnSafely('revenue_saved_reports', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('revenue_saved_reports', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('revenue_saved_reports', 'updated_by', 'VARCHAR(100) NULL');

-- Table: contract_modifications
CALL AddColumnSafely('contract_modifications', 'id', 'VARCHAR(100) NOT NULL');
CALL AddColumnSafely('contract_modifications', 'created_at', 'DATETIME(6) NOT NULL');
CALL AddColumnSafely('contract_modifications', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('contract_modifications', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('contract_modifications', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('contract_modifications', 'updated_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('contract_modifications', 'updated_by', 'VARCHAR(100) NULL');

-- Table: journal_entries
CALL AddColumnSafely('journal_entries', 'id', 'VARCHAR(100) NOT NULL');
CALL AddColumnSafely('journal_entries', 'created_at', 'DATETIME(6) NOT NULL');
CALL AddColumnSafely('journal_entries', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('journal_entries', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('journal_entries', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('journal_entries', 'updated_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('journal_entries', 'updated_by', 'VARCHAR(100) NULL');

-- Table: performance_obligations
CALL AddColumnSafely('performance_obligations', 'id', 'VARCHAR(100) NOT NULL');
CALL AddColumnSafely('performance_obligations', 'created_at', 'DATETIME(6) NOT NULL');
CALL AddColumnSafely('performance_obligations', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('performance_obligations', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('performance_obligations', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('performance_obligations', 'updated_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('performance_obligations', 'updated_by', 'VARCHAR(100) NULL');

-- Table: revenue_schedules
CALL AddColumnSafely('revenue_schedules', 'id', 'VARCHAR(100) NOT NULL');
CALL AddColumnSafely('revenue_schedules', 'created_at', 'DATETIME(6) NOT NULL');
CALL AddColumnSafely('revenue_schedules', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('revenue_schedules', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('revenue_schedules', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('revenue_schedules', 'updated_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('revenue_schedules', 'updated_by', 'VARCHAR(100) NULL');

-- Table: revrec_audit_trails
CALL AddColumnSafely('revrec_audit_trails', 'id', 'VARCHAR(100) NOT NULL');
CALL AddColumnSafely('revrec_audit_trails', 'created_at', 'DATETIME(6) NOT NULL');
CALL AddColumnSafely('revrec_audit_trails', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('revrec_audit_trails', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('revrec_audit_trails', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('revrec_audit_trails', 'updated_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('revrec_audit_trails', 'updated_by', 'VARCHAR(100) NULL');

-- Table: api_keys
CALL AddColumnSafely('api_keys', 'key_prefix', 'VARCHAR(20) NOT NULL');
CALL AddColumnSafely('api_keys', 'key_hash', 'VARCHAR(500) NOT NULL');

-- Table: security_ip_allowlist
CALL AddColumnSafely('security_ip_allowlist', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('security_ip_allowlist', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('security_ip_allowlist', 'updated_by', 'VARCHAR(100) NULL');

-- Table: opz_notifications
CALL AddColumnSafely('opz_notifications', 'created_by', 'VARCHAR(100) NULL');
CALL AddColumnSafely('opz_notifications', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('opz_notifications', 'tenant_id', 'VARCHAR(100) NULL');
CALL AddColumnSafely('opz_notifications', 'updated_by', 'VARCHAR(100) NULL');

-- Table: subscription_addons
CALL AddColumnSafely('subscription_addons', 'deleted_at', 'DATETIME(6) NULL');

-- Table: subscription_events
CALL AddColumnSafely('subscription_events', 'created_at', 'DATETIME(6) NOT NULL');
CALL AddColumnSafely('subscription_events', 'deleted_at', 'DATETIME(6) NULL');
CALL AddColumnSafely('subscription_events', 'updated_at', 'DATETIME(6) NULL');

DROP PROCEDURE IF EXISTS AddColumnSafely;
