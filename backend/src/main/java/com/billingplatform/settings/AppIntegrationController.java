package com.billingplatform.settings;

import com.billingplatform.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/apps")
@RequiredArgsConstructor
public class AppIntegrationController {

    private final AppIntegrationRepository appIntegrationRepository;

    @PreAuthorize("@accessControl.hasPermission(null, 'APPS_VIEW')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<AppIntegration>>> getApps() {
        return ResponseEntity.ok(ApiResponse.success(appIntegrationRepository.findAll()));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'APPS_CREATE')")
    @PostMapping("/{appId}/connect")
    public ResponseEntity<ApiResponse<AppIntegration>> connectApp(@PathVariable String appId) {
        AppIntegration app = appIntegrationRepository.findByAppId(appId)
                .orElseThrow(() -> new RuntimeException("App not found: " + appId));
        app.setStatus(AppIntegration.AppStatus.CONNECTED);
        app.setConnectedAt(LocalDateTime.now());
        return ResponseEntity.ok(ApiResponse.success(appIntegrationRepository.save(app)));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'APPS_CREATE')")
    @PostMapping("/{appId}/disconnect")
    public ResponseEntity<ApiResponse<AppIntegration>> disconnectApp(@PathVariable String appId) {
        AppIntegration app = appIntegrationRepository.findByAppId(appId)
                .orElseThrow(() -> new RuntimeException("App not found: " + appId));
        app.setStatus(AppIntegration.AppStatus.DISCONNECTED);
        app.setConnectedAt(null);
        return ResponseEntity.ok(ApiResponse.success(appIntegrationRepository.save(app)));
    }
}
