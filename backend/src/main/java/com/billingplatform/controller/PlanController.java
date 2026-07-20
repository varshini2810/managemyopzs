package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;

import com.billingplatform.model.PlanPricePoint;
import com.billingplatform.model.Plan;


import org.springframework.security.access.prepost.PreAuthorize;
import com.billingplatform.dto.ApiResponse;
import com.billingplatform.exception.ResourceNotFoundException;
import com.billingplatform.util.SlugUtils;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class PlanController {

    private final PlanRepository planRepository;
    private final PlanPricePointRepository pricePointRepository;

    @PreAuthorize("@accessControl.hasPermission(null, 'PLAN_VIEW')")
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> list(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Plan> result = planRepository.findAllActive(search, pageable);
        Map<String, Object> data = Map.of(
                "content", result.getContent(),
                "totalElements", result.getTotalElements(),
                "totalPages", result.getTotalPages(),
                "page", result.getNumber(),
                "size", result.getSize()
        );
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'PLAN_VIEW')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Plan>> getOne(@PathVariable String id) {
        Plan plan = planRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan", id));
        return ResponseEntity.ok(ApiResponse.success(plan));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'PLAN_CREATE')")
    @PostMapping
    public ResponseEntity<ApiResponse<Plan>> create(@Valid @RequestBody CreatePlanRequest req) {
        String id = (req.getId() != null && !req.getId().isBlank())
                ? req.getId() : SlugUtils.toSlug(req.getInternalName());
        Plan plan = Plan.builder()
                .id(id)
                .productFamilyId(req.getProductFamilyId())
                .internalName(req.getInternalName())
                .description(req.getDescription())
                .displaySelfServe(Boolean.TRUE.equals(req.getDisplaySelfServe()))
                .displayCheckout(Boolean.TRUE.equals(req.getDisplayCheckout()))
                .build();
        return ResponseEntity.ok(ApiResponse.success(planRepository.save(plan), "Plan created"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'PLAN_EDIT')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Plan>> update(@PathVariable String id, @Valid @RequestBody CreatePlanRequest req) {
        Plan plan = planRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan", id));
        plan.setInternalName(req.getInternalName());
        plan.setDescription(req.getDescription());
        plan.setProductFamilyId(req.getProductFamilyId());
        plan.setDisplaySelfServe(Boolean.TRUE.equals(req.getDisplaySelfServe()));
        plan.setDisplayCheckout(Boolean.TRUE.equals(req.getDisplayCheckout()));
        return ResponseEntity.ok(ApiResponse.success(planRepository.save(plan), "Plan updated"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'PLAN_DELETE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        Plan plan = planRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan", id));
        plan.softDelete();
        planRepository.save(plan);
        return ResponseEntity.ok(ApiResponse.success(null, "Plan deleted"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'PLAN_VIEW')")
    @GetMapping("/{id}/price-points")
    public ResponseEntity<ApiResponse<List<PlanPricePoint>>> getPricePoints(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(pricePointRepository.findByPlanIdAndDeletedAtIsNull(id)));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'PLAN_CREATE')")
    @PostMapping("/{id}/price-points")
    public ResponseEntity<ApiResponse<PlanPricePoint>> addPricePoint(
            @PathVariable String id, @Valid @RequestBody CreatePricePointRequest req) {
        planRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan", id));
        String ppId = SlugUtils.toSlug(req.getInternalName()) + "-" + id;
        PlanPricePoint pp = PlanPricePoint.builder()
                .id(ppId)
                .planId(id)
                .externalName(req.getExternalName())
                .internalName(req.getInternalName())
                .pricingModel(PlanPricePoint.PricingModel.valueOf(req.getPricingModel()))
                .price(req.getPrice())
                .currency(req.getCurrency() != null ? req.getCurrency() : "USD")
                .billingCycle(PlanPricePoint.BillingCycle.valueOf(req.getBillingCycle()))
                .hasTrial(Boolean.TRUE.equals(req.getHasTrial()))
                .trialPeriodDays(req.getTrialPeriodDays() != null ? req.getTrialPeriodDays() : 0)
                .displaySelfServe(Boolean.TRUE.equals(req.getDisplaySelfServe()))
                .displayCheckout(Boolean.TRUE.equals(req.getDisplayCheckout()))
                .build();
        return ResponseEntity.ok(ApiResponse.success(pricePointRepository.save(pp), "Price point created"));
    }

    @Data
    public static class CreatePlanRequest {
        @NotBlank(message = "Internal name is required")
        @jakarta.validation.constraints.Pattern(regexp = "^[a-zA-Z0-9 -]+$", message = "Name can only contain alphanumeric characters, spaces, and hyphens")
        private String internalName;
        private String description;
        private String productFamilyId;
        private String id;
        private Boolean displaySelfServe;
        private Boolean displayCheckout;
    }

    @Data
    public static class CreatePricePointRequest {
        @NotBlank(message = "External name is required")
        @jakarta.validation.constraints.Pattern(regexp = "^[a-zA-Z0-9 -]+$", message = "Name can only contain alphanumeric characters, spaces, and hyphens")
        private String externalName;
        @NotBlank(message = "Internal name is required")
        @jakarta.validation.constraints.Pattern(regexp = "^[a-zA-Z0-9 -]+$", message = "Name can only contain alphanumeric characters, spaces, and hyphens")
        private String internalName;
        private String pricingModel = "flat_fee";
        @jakarta.validation.constraints.NotNull(message = "Price is required")
        private java.math.BigDecimal price;
        private String currency = "USD";
        private String billingCycle = "monthly";
        private Boolean hasTrial;
        private Integer trialPeriodDays;
        private Boolean displaySelfServe;
        private Boolean displayCheckout;
    }
}


