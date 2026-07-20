package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;

import com.billingplatform.model.Addon;


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

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/addons")
@RequiredArgsConstructor
public class AddonController {

    private final AddonRepository addonRepository;

    @PreAuthorize("@accessControl.hasPermission(null, 'ADDON_VIEW')")
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> list(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Addon> result = addonRepository.findAllActive(search, pageable);
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "content", result.getContent(),
                "totalElements", result.getTotalElements(),
                "totalPages", result.getTotalPages()
        )));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'ADDON_VIEW')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Addon>> getOne(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(
                addonRepository.findByIdAndDeletedAtIsNull(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Addon", id))));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'ADDON_CREATE')")
    @PostMapping
    public ResponseEntity<ApiResponse<Addon>> create(@Valid @RequestBody AddonRequest req) {
        String id = (req.getId() != null && !req.getId().isBlank()) ? req.getId() : SlugUtils.toSlug(req.getName());
        Addon addon = Addon.builder()
                .id(id).name(req.getName()).description(req.getDescription())
                .productFamilyId(req.getProductFamilyId())
                .pricingModel(Addon.PricingModel.valueOf(req.getPricingModel() != null ? req.getPricingModel() : "flat_fee"))
                .price(req.getPrice() != null ? req.getPrice() : BigDecimal.ZERO)
                .currency(req.getCurrency() != null ? req.getCurrency() : "USD")
                .chargeType(Addon.ChargeType.valueOf(req.getChargeType() != null ? req.getChargeType() : "recurring"))
                .displaySelfServe(Boolean.TRUE.equals(req.getDisplaySelfServe()))
                .displayCheckout(Boolean.TRUE.equals(req.getDisplayCheckout()))
                .build();
        return ResponseEntity.ok(ApiResponse.success(addonRepository.save(addon), "Addon created"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'ADDON_EDIT')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Addon>> update(@PathVariable String id, @Valid @RequestBody AddonRequest req) {
        Addon addon = addonRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Addon", id));
        addon.setName(req.getName()); addon.setDescription(req.getDescription());
        addon.setPrice(req.getPrice()); addon.setCurrency(req.getCurrency());
        return ResponseEntity.ok(ApiResponse.success(addonRepository.save(addon), "Addon updated"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'ADDON_DELETE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        Addon addon = addonRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Addon", id));
        addon.softDelete(); addonRepository.save(addon);
        return ResponseEntity.ok(ApiResponse.success(null, "Addon deleted"));
    }

    @Data
    public static class AddonRequest {
        @NotBlank(message = "Name is required")
        private String name;
        private String description, id, productFamilyId, pricingModel, currency, chargeType;
        private BigDecimal price;
        private Boolean displaySelfServe, displayCheckout;
    }
}
