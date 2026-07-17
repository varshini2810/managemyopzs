package com.billingplatform.settings;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/settings/opz-notifications")
public class OpzNotificationController {

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_NOTIFICATIONS_VIEW')")
    @GetMapping
    public ResponseEntity<Map<String, Object>> getNotifications() {
        return ResponseEntity.ok(Collections.singletonMap("data", Collections.emptyList()));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_NOTIFICATIONS_CREATE')")
    @PostMapping
    public ResponseEntity<Map<String, Object>> createNotification(@RequestBody Map<String, Object> req) {
        return ResponseEntity.ok(Collections.singletonMap("data", "notification created"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_NOTIFICATIONS_EDIT')")
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateNotification(@PathVariable Long id, @RequestBody Map<String, Object> req) {
        return ResponseEntity.ok(Collections.singletonMap("data", "notification updated"));
    }
}
