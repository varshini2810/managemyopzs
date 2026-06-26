package com.billingplatform.settings;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/settings/security")
public class SecurityController {

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_SECURITY_VIEW')")
    @GetMapping("/authentication")
    public ResponseEntity<Map<String, Object>> getAuthSettings() {
        return ResponseEntity.ok(Collections.singletonMap("data", "auth settings"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_SECURITY_EDIT')")
    @PutMapping("/authentication")
    public ResponseEntity<Map<String, Object>> updateAuthSettings(@RequestBody Map<String, Object> req) {
        return ResponseEntity.ok(Collections.singletonMap("data", "auth settings updated"));
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
    public ResponseEntity<Map<String, Object>> addIpToAllowlist(@RequestBody Map<String, Object> req) {
        return ResponseEntity.ok(Collections.singletonMap("data", "ip added"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_SECURITY_DELETE')")
    @DeleteMapping("/ip-allowlist/{id}")
    public ResponseEntity<Map<String, Object>> removeIpFromAllowlist(@PathVariable Long id) {
        return ResponseEntity.ok(Collections.singletonMap("data", "ip removed"));
    }
}
