-- V11: Create email logs table
CREATE TABLE IF NOT EXISTS email_logs (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    customer_id VARCHAR(100),
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    template_name VARCHAR(100),
    status ENUM('SENT', 'DELIVERED', 'BOUNCED', 'FAILED', 'SPAM_COMPLAINT') NOT NULL DEFAULT 'SENT',
    opened_at TIMESTAMP NULL,
    clicked_at TIMESTAMP NULL,
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email_log_customer (customer_id),
    INDEX idx_email_log_status (status)
);
