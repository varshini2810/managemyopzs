package com.billingplatform.auth;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import jakarta.servlet.http.HttpServletRequest;

@Aspect
@Component
public class TenantEnforcementAspect {

    @Before("@annotation(org.springframework.web.bind.annotation.PostMapping) || @annotation(org.springframework.web.bind.annotation.PutMapping)")
    public void enforceTenantContextForWrites() {
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attr != null) {
            HttpServletRequest request = attr.getRequest();
            String uri = request.getRequestURI();
            
            // Skip auth, tenants, webhooks, and public endpoints
            if (uri.startsWith("/api/auth") || uri.startsWith("/api/tenants") || uri.startsWith("/api/webhooks") || uri.startsWith("/api/public")) {
                return;
            }

            // For all other API writes, tenantId must be set in context
            if (uri.startsWith("/api/")) {
                String tenantId = CurrentTenantContext.getTenantId();
                if (tenantId == null || tenantId.trim().isEmpty() || "PLATFORM".equalsIgnoreCase(tenantId) || "null".equalsIgnoreCase(tenantId)) {
                    throw new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.BAD_REQUEST, 
                        "No valid tenant context available. Please provide a valid tenant ID via X-Tenant-ID header."
                    );
                }
            }
        }
    }
}
