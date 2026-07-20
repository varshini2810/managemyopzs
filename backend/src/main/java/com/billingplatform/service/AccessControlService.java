package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service("accessControl")
@RequiredArgsConstructor
public class AccessControlService {

    public boolean hasPermission(String requestedTenantId, String permissionKey) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof CustomUserDetails)) {
            return false;
        }

        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        String role = userDetails.getRole();

        // Ultrasuperadmin bypasses all checks
        if (role != null && (
            role.equalsIgnoreCase("ULTRASUPERADMIN") || 
            role.equalsIgnoreCase("Platform Ultrasuperadmin") || 
            role.equalsIgnoreCase("PLATFORM OWNER")
        )) {
            return true;
        }

        // Superadmin/Admin/User MUST match tenantId (if requestedTenantId is provided)
        if (requestedTenantId != null && !requestedTenantId.equals(userDetails.getTenantId())) {
            return false;
        }

        // For Superadmin, check if the permission exists in their base role permissions
        if ("SUPERADMIN".equalsIgnoreCase(role)) {
            return userDetails.getPermissions() != null && userDetails.getPermissions().contains(permissionKey);
        }

        // For Admin, check if they have the permission AND it belongs to a module they have access to
        if ("ADMIN".equalsIgnoreCase(role)) {
            // First check if role has the permission at all (our DB seeds all permissions to ADMIN)
            if (userDetails.getPermissions() == null || !userDetails.getPermissions().contains(permissionKey)) {
                return false;
            }
            
            // Now check dynamic granted_modules overrides
            if (userDetails.getGrantedModules() == null) {
                return false; // No modules granted
            }

            // Map permission_key to module. E.g. INVOICE_CREATE -> billing:invoices
            String moduleKey = getModuleKeyForPermission(permissionKey);
            if (moduleKey == null) {
                return false; // Unknown permission
            }

            return userDetails.getGrantedModules().contains(moduleKey);
        }

        // For User, check if the permission exists in their base read-only role permissions
        if ("USER".equalsIgnoreCase(role)) {
            return userDetails.getPermissions() != null && userDetails.getPermissions().contains(permissionKey);
        }

        return false;
    }

    private String getModuleKeyForPermission(String permissionKey) {
        if (permissionKey.startsWith("CUSTOMER_")) return "CUSTOMER";
        if (permissionKey.startsWith("SUBSCRIPTION_")) return "SUBSCRIPTION";
        if (permissionKey.startsWith("INVOICE_") || permissionKey.startsWith("CREDIT_NOTE_")) return "INVOICE";
        if (permissionKey.startsWith("PRODUCT_FAMILY_") || permissionKey.startsWith("PLAN_") || 
            permissionKey.startsWith("ADDON_") || permissionKey.startsWith("CHARGE_") || 
            permissionKey.startsWith("COUPON_") || permissionKey.startsWith("COUPON_SET_")) return "PRODUCT_CATALOG";
        if (permissionKey.startsWith("LOGS_") || permissionKey.startsWith("WEBHOOK_")) return "LOGS";
        if (permissionKey.startsWith("DASHBOARDS_") || permissionKey.startsWith("METRIC_EXPLORER_") || 
            permissionKey.startsWith("CUSTOMER_INSIGHTS_") || permissionKey.startsWith("ACCOUNTING_REPORTS_") || 
            permissionKey.startsWith("ALERTS_GOALS_") || permissionKey.startsWith("REPORT_BUILDER_")) return "REVENUE_STORY";
        if (permissionKey.startsWith("REPORTS_")) return "REPORTS";
        if (permissionKey.startsWith("APPS_")) return "APPS";
        if (permissionKey.startsWith("SETTINGS_")) return "SETTINGS"; // Settings are usually SUPERADMIN only anyway, but just in case mapped
        if (permissionKey.startsWith("CPQ_")) return "CPQ";
        if (permissionKey.startsWith("RECEIVABLES_")) return "RECEIVABLES";
        if (permissionKey.startsWith("RETENTION_")) return "RETENTION";
        if (permissionKey.startsWith("REVREC_")) return "REVREC";
        if (permissionKey.startsWith("PAYMENTS_")) return "PAYMENTS";
        if (permissionKey.startsWith("GROWTH_")) return "GROWTH";

        return null;
    }
}
