package com.billingplatform.dashboard;


import org.springframework.security.access.prepost.PreAuthorize;
import com.billingplatform.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @PreAuthorize("@accessControl.hasPermission(null, 'DASHBOARDS_VIEW')")
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSummary() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getSummary()));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'DASHBOARDS_VIEW')")
    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMetrics(
            @RequestParam String type,
            @RequestParam(defaultValue = "3m") String range) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getMetrics(type, range)));
    }
}
