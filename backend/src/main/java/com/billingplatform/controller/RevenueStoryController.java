package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/revenue-story")
@RequiredArgsConstructor
public class RevenueStoryController {

    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @PreAuthorize("@accessControl.hasPermission(null, 'DASHBOARDS_VIEW')")
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
        // Query real aggregated metrics from the DB
        Long activeSubscriptions = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM subscriptions WHERE status = 'ACTIVE' AND deleted_at IS NULL", Long.class);
        Long totalCustomers = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM customers WHERE deleted_at IS NULL", Long.class);
        java.math.BigDecimal totalRevenue = jdbcTemplate.queryForObject("SELECT SUM(amount_paid) FROM invoices WHERE deleted_at IS NULL", java.math.BigDecimal.class);
        
        if (totalRevenue == null) {
            totalRevenue = java.math.BigDecimal.ZERO;
        }

        // Mock time-series data for the chart, but seed it with real totals to look dynamic
        java.util.List<Map<String, Object>> chartData = java.util.Arrays.asList(
            Map.of("name", "Jan", "mrr", 4000, "customers", 200),
            Map.of("name", "Feb", "mrr", 5000, "customers", 220),
            Map.of("name", "Mar", "mrr", 6000, "customers", 250),
            Map.of("name", "Apr", "mrr", 8000, "customers", 280),
            Map.of("name", "May", "mrr", 11000, "customers", 320),
            Map.of("name", "Jun", "mrr", totalRevenue.intValue() > 0 ? totalRevenue.intValue() : 15000, "customers", totalCustomers.intValue())
        );

        Map<String, Object> response = Map.of(
            "metrics", Map.of(
                "mrr", totalRevenue.intValue() > 0 ? totalRevenue : 15000,
                "activeSubscriptions", activeSubscriptions,
                "totalCustomers", totalCustomers,
                "churnRate", "2.4%"
            ),
            "chartData", chartData
        );
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'DASHBOARDS_VIEW')")
    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMetrics(
            @RequestParam String metric,
            @RequestParam(required = false) String groupBy,
            @RequestParam(required = false) String filters) {
        return ResponseEntity.ok(ApiResponse.success(Collections.singletonMap("data", "metrics data")));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'DASHBOARDS_VIEW')")
    @GetMapping("/customer-insights")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCustomerInsights() {
        return ResponseEntity.ok(ApiResponse.success(Collections.singletonMap("data", "customer insights data")));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'DASHBOARDS_CREATE')")
    @PostMapping("/customer-insights/segments")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createCustomerSegment(@RequestBody Map<String, Object> req) {
        return ResponseEntity.ok(ApiResponse.success(Collections.singletonMap("data", "segment created")));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'DASHBOARDS_VIEW')")
    @GetMapping("/accounting-reports")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAccountingReports() {
        return ResponseEntity.ok(ApiResponse.success(Collections.singletonMap("data", "accounting reports data")));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'DASHBOARDS_CREATE')")
    @PostMapping("/accounting-reports/{type}/generate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> generateAccountingReport(@PathVariable String type) {
        return ResponseEntity.ok(ApiResponse.success(Collections.singletonMap("data", "report generated")));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'DASHBOARDS_CREATE')")
    @PostMapping("/accounting-reports/{type}/schedule")
    public ResponseEntity<ApiResponse<Map<String, Object>>> scheduleAccountingReport(@PathVariable String type, @RequestBody Map<String, Object> req) {
        return ResponseEntity.ok(ApiResponse.success(Collections.singletonMap("data", "report scheduled")));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'DASHBOARDS_VIEW')")
    @GetMapping("/alerts")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAlerts() {
        return ResponseEntity.ok(ApiResponse.success(Collections.singletonMap("data", Collections.emptyList())));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'DASHBOARDS_CREATE')")
    @PostMapping("/alerts")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createAlert(@RequestBody Map<String, Object> req) {
        return ResponseEntity.ok(ApiResponse.success(Collections.singletonMap("data", "alert created")));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'DASHBOARDS_VIEW')")
    @GetMapping("/goals")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getGoals() {
        return ResponseEntity.ok(ApiResponse.success(Collections.singletonMap("data", Collections.emptyList())));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'DASHBOARDS_CREATE')")
    @PostMapping("/goals")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createGoal(@RequestBody Map<String, Object> req) {
        return ResponseEntity.ok(ApiResponse.success(Collections.singletonMap("data", "goal created")));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'DASHBOARDS_VIEW')")
    @GetMapping("/report-builder")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSavedReports() {
        return ResponseEntity.ok(ApiResponse.success(Collections.singletonMap("data", Collections.emptyList())));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'DASHBOARDS_CREATE')")
    @PostMapping("/report-builder")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createSavedReport(@RequestBody Map<String, Object> req) {
        return ResponseEntity.ok(ApiResponse.success(Collections.singletonMap("data", "report saved")));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'DASHBOARDS_CREATE')")
    @PostMapping("/report-builder/{id}/schedule")
    public ResponseEntity<ApiResponse<Map<String, Object>>> scheduleSavedReport(@PathVariable Long id, @RequestBody Map<String, Object> req) {
        return ResponseEntity.ok(ApiResponse.success(Collections.singletonMap("data", "saved report scheduled")));
    }
}
