package com.billingplatform.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class AuditLogger {

    private static final Logger auditLog = LoggerFactory.getLogger("AUDIT_LOG");

    public void logAuthAttempt(String username, String ipAddress, boolean success) {
        String maskedUser = maskString(username);
        if (success) {
            auditLog.info("AUTH_SUCCESS | User: {} | IP: {}", maskedUser, ipAddress);
        } else {
            auditLog.warn("AUTH_FAILED | User: {} | IP: {}", maskedUser, ipAddress);
        }
    }

    public void logPermissionDenial(String username, String resource) {
        auditLog.warn("ACCESS_DENIED | User: {} | Resource: {}", maskString(username), resource);
    }

    public void logTransaction(String username, String action, String resourceId, String details) {
        auditLog.info("TRANSACTION | User: {} | Action: {} | Resource: {} | Details: {}", 
            maskString(username), action, resourceId, details);
    }

    private String maskString(String input) {
        if (input == null || input.length() < 3) {
            return "***";
        }
        if (input.contains("@")) {
            String[] parts = input.split("@");
            if (parts[0].length() > 2) {
                return parts[0].substring(0, 2) + "***@" + parts[1];
            } else {
                return "***@" + parts[1];
            }
        }
        return input.substring(0, 2) + "***" + input.substring(input.length() - 1);
    }
}
