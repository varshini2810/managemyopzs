package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;

import com.billingplatform.model.Subscription;
import com.billingplatform.service.SubscriptionService;

import com.billingplatform.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PreAuthorize("@accessControl.hasPermission(null, 'SUBSCRIPTION_VIEW')")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<Subscription>>> getSubscriptions(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String customerId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Subscription> subs = subscriptionService.getSubscriptions(status, customerId, search, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(subs));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SUBSCRIPTION_VIEW')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Subscription>> getSubscription(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(subscriptionService.getSubscription(id)));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SUBSCRIPTION_CREATE')")
    @PostMapping
    public ResponseEntity<ApiResponse<Subscription>> createSubscription(@Valid @RequestBody Subscription subscription) {
        return ResponseEntity.ok(ApiResponse.success(subscriptionService.createSubscription(subscription)));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SUBSCRIPTION_PAUSE')")
    @PostMapping("/{id}/pause")
    public ResponseEntity<ApiResponse<Subscription>> pauseSubscription(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(subscriptionService.pauseSubscription(id)));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SUBSCRIPTION_CREATE')")
    @PostMapping("/{id}/resume")
    public ResponseEntity<ApiResponse<Subscription>> resumeSubscription(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(subscriptionService.resumeSubscription(id)));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SUBSCRIPTION_CANCEL')")
    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Subscription>> cancelSubscription(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(subscriptionService.cancelSubscription(id)));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SUBSCRIPTION_CREATE')")
    @PostMapping("/{id}/reactivate")
    public ResponseEntity<ApiResponse<Subscription>> reactivateSubscription(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(subscriptionService.reactivateSubscription(id)));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SUBSCRIPTION_VIEW')")
    @GetMapping("/{id}/events")
    public ResponseEntity<ApiResponse<Object>> getEvents(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(subscriptionService.getEvents(id)));
    }
}

