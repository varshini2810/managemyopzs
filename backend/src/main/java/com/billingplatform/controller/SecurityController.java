package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;

import com.billingplatform.model.SecuritySettings;
import com.billingplatform.repository.SecuritySettingsRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.Collections;
import java.util.Map;

import org.springframework.security.core.Authentication;
import com.billingplatform.model.CustomUserDetails;
import com.billingplatform.dto.ApiResponse;

@RestController
@RequestMapping("/api/settings/security")
public class SecurityController {

    private final SecuritySettingsRepository securitySettingsRepository;

    public SecurityController(SecuritySettingsRepository securitySettingsRepository) {
        this.securitySettingsRepository = securitySettingsRepository;
    }

    private String getTenantId(Authentication auth) {
        if (auth.getPrincipal() instanceof CustomUserDetails) {
            String tenantId = ((CustomUserDetails) auth.getPrincipal()).getTenantId();
            return tenantId != null ? tenantId : "PLATFORM";
        }
        return "PLATFORM";
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_SECURITY_VIEW')")
    @GetMapping("/authentication")
    public ResponseEntity<ApiResponse<SecuritySettings>> getAuthSettings(Authentication auth) {
        String tenantId = getTenantId(auth);
        SecuritySettings settings = securitySettingsRepository.findByTenantId(tenantId)
                .orElseGet(() -> SecuritySettings.builder().tenantId(tenantId).build());
        return ResponseEntity.ok(ApiResponse.success(settings));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_SECURITY_EDIT')")
    @PutMapping("/authentication")
    public ResponseEntity<ApiResponse<SecuritySettings>> updateAuthSettings(Authentication auth, @Valid @RequestBody SecuritySettings req) {
        String tenantId = getTenantId(auth);
        SecuritySettings settings = securitySettingsRepository.findByTenantId(tenantId)
                .orElseGet(() -> SecuritySettings.builder().tenantId(tenantId).build());
        
        settings.setMinLength(req.getMinLength());
        settings.setComplexity(req.getComplexity());
        settings.setMfaEnabled(req.isMfaEnabled());
        settings.setSessionTimeout(req.getSessionTimeout());
        
        SecuritySettings saved = securitySettingsRepository.save(settings);
        return ResponseEntity.ok(ApiResponse.success(saved));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_SECURITY_VIEW')")
    @GetMapping("/audit-logs")
    public ResponseEntity<Map<String, Object>> getAuditLogs() {
        return ResponseEntity.ok(Collections.singletonMap("data", Collections.emptyList()));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_SECURITY_VIEW')")
    @GetMapping("/ip-allowlist")
    public ResponseEntity<Map<String, Object>> getIpAllowlist() {
        return ResponseEntity.ok(Collections.singletonMap("data", Collections.emptyList()));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_SECURITY_CREATE')")
    @PostMapping("/ip-allowlist")
    public ResponseEntity<Map<String, Object>> addIpToAllowlist(@Valid @RequestBody Map<String, Object> req) {
        return ResponseEntity.ok(Collections.singletonMap("data", "ip added"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_SECURITY_DELETE')")
    @DeleteMapping("/ip-allowlist/{id}")
    public ResponseEntity<Map<String, Object>> removeIpFromAllowlist(@PathVariable Long id) {
        return ResponseEntity.ok(Collections.singletonMap("data", "ip removed"));
    }
}

