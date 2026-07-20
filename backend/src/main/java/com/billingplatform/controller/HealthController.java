package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;

import com.billingplatform.dto.ApiResponse;

import com.billingplatform.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthController {

    private final TenantRepository tenantRepository;
    private final JavaMailSender mailSender;

    @GetMapping
    @PreAuthorize("hasRole('ULTRASUPERADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealth() {
        long activeTenants = tenantRepository.count();
        Runtime runtime = Runtime.getRuntime();
        long memoryUsage = (runtime.totalMemory() - runtime.freeMemory()) / (1024 * 1024);

        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "status", "UP",
                "db", "CONNECTED",
                "active_tenants", activeTenants,
                "memory_usage", memoryUsage + " MB"
        )));
    }

    @GetMapping("/test-email")
    public ResponseEntity<ApiResponse<String>> testEmail() {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("sanjayforantigravity@gmail.com");
            message.setTo("official.sanjayx@gmail.com");
            message.setSubject("Test Email from Billing Platform");
            message.setText("Hello Sanjay, this is a test email from the billing platform!");
            mailSender.send(message);
            return ResponseEntity.ok(ApiResponse.success("Email sent successfully to official.sanjayx@gmail.com"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to send email: " + e.getMessage()));
        }
    }
}
