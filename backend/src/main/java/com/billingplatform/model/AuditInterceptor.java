package com.billingplatform.model;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;

import com.billingplatform.repository.AuditLogRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class AuditInterceptor implements HandlerInterceptor {

    private final AuditLogRepository auditLogRepository;

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        String method = request.getMethod();
        if (method.equals("GET") || method.equals("OPTIONS")) return; // Only log modifications

        String uri = request.getRequestURI();
        if (uri.startsWith("/api/auth")) return; // Don't log login/refresh to avoid noise

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String user = (auth != null && auth.isAuthenticated()) ? auth.getName() : "system";
        
        String action = switch (method) {
            case "POST" -> "CREATE";
            case "PUT", "PATCH" -> "UPDATE";
            case "DELETE" -> "DELETE";
            default -> "UPDATE";
        };

        // Extract a basic entity type from URI
        String[] parts = uri.split("/");
        String entityType = parts.length > 2 ? parts[2].toUpperCase() : "UNKNOWN";
        String entityId = parts.length > 3 ? parts[3] : "bulk";

        AuditLog log = AuditLog.builder()
                .entityType(entityType)
                .entityId(entityId)
                .action(action)
                .changedBy(user)
                .ipAddress(request.getRemoteAddr())
                .build();

        auditLogRepository.save(log);
    }
}
