-- V20: Create missing tables expected by JPA entities

-- Table: a_r_collections_queues
CREATE TABLE IF NOT EXISTS `a_r_collections_queues` (
  `id` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: at_risk_signals
CREATE TABLE IF NOT EXISTS `at_risk_signals` (
  `id` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: cancel_flow_configs
CREATE TABLE IF NOT EXISTS `cancel_flow_configs` (
  `id` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: checkout_funnel_events
CREATE TABLE IF NOT EXISTS `checkout_funnel_events` (
  `id` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: churn_reasons
CREATE TABLE IF NOT EXISTS `churn_reasons` (
  `id` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: contract_modifications
CREATE TABLE IF NOT EXISTS `contract_modifications` (
  `id` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: disputes
CREATE TABLE IF NOT EXISTS `disputes` (
  `id` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: gateway_health_logs
CREATE TABLE IF NOT EXISTS `gateway_health_logs` (
  `id` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: journal_entries
CREATE TABLE IF NOT EXISTS `journal_entries` (
  `id` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: payment_reconciliations
CREATE TABLE IF NOT EXISTS `payment_reconciliations` (
  `id` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: payment_sources
CREATE TABLE IF NOT EXISTS `payment_sources` (
  `id` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: payment_transactions
CREATE TABLE IF NOT EXISTS `payment_transactions` (
  `id` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: payouts
CREATE TABLE IF NOT EXISTS `payouts` (
  `id` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: performance_obligations
CREATE TABLE IF NOT EXISTS `performance_obligations` (
  `id` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: pricing_experiments
CREATE TABLE IF NOT EXISTS `pricing_experiments` (
  `id` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: quote_approvals
CREATE TABLE IF NOT EXISTS `quote_approvals` (
  `id` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: quote_line_items
CREATE TABLE IF NOT EXISTS `quote_line_items` (
  `id` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: quotes
CREATE TABLE IF NOT EXISTS `quotes` (
  `id` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: referral_programs
CREATE TABLE IF NOT EXISTS `referral_programs` (
  `id` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: refunds
CREATE TABLE IF NOT EXISTS `refunds` (
  `id` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: retention_activity_logs
CREATE TABLE IF NOT EXISTS `retention_activity_logs` (
  `id` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: revenue_schedules
CREATE TABLE IF NOT EXISTS `revenue_schedules` (
  `id` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: revrec_audit_trails
CREATE TABLE IF NOT EXISTS `revrec_audit_trails` (
  `id` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: upsell_rules
CREATE TABLE IF NOT EXISTS `upsell_rules` (
  `id` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: winback_campaigns
CREATE TABLE IF NOT EXISTS `winback_campaigns` (
  `id` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: write_offs
CREATE TABLE IF NOT EXISTS `write_offs` (
  `id` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: credit_note_number_sequences
CREATE TABLE IF NOT EXISTS `credit_note_number_sequences` (
  `tenant_id` varchar(100) NOT NULL,
  `current_year` int NOT NULL,
  `last_sequence` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`tenant_id`,`current_year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

