package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;

import com.billingplatform.model.Charge;


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
@RequestMapping("/api/charges")
@RequiredArgsConstructor
public class ChargeController {

    private final ChargeRepository chargeRepository;

    @PreAuthorize("@accessControl.hasPermission(null, 'CHARGE_VIEW')")
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> list(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Charge> result = chargeRepository.findAllActive(search, pageable);
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "content", result.getContent(),
                "totalElements", result.getTotalElements(),
                "totalPages", result.getTotalPages()
        )));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'CHARGE_VIEW')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Charge>> getOne(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(
                chargeRepository.findByIdAndDeletedAtIsNull(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Charge", id))));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'CHARGE_CREATE')")
    @PostMapping
    public ResponseEntity<ApiResponse<Charge>> create(@Valid @RequestBody ChargeRequest req) {
        String id = (req.getId() != null && !req.getId().isBlank()) ? req.getId() : SlugUtils.toSlug(req.getName());
        Charge charge = Charge.builder()
                .id(id).name(req.getName()).description(req.getDescription())
                .price(req.getPrice() != null ? req.getPrice() : BigDecimal.ZERO)
                .currency(req.getCurrency() != null ? req.getCurrency() : "USD")
                .taxable(Boolean.TRUE.equals(req.getTaxable()))
                .build();
        return ResponseEntity.ok(ApiResponse.success(chargeRepository.save(charge), "Charge created"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'CHARGE_EDIT')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Charge>> update(@PathVariable String id, @Valid @RequestBody ChargeRequest req) {
        Charge charge = chargeRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Charge", id));
        charge.setName(req.getName()); charge.setDescription(req.getDescription());
        charge.setPrice(req.getPrice()); charge.setCurrency(req.getCurrency());
        charge.setTaxable(Boolean.TRUE.equals(req.getTaxable()));
        return ResponseEntity.ok(ApiResponse.success(chargeRepository.save(charge), "Charge updated"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'CHARGE_DELETE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        Charge charge = chargeRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Charge", id));
        charge.softDelete(); chargeRepository.save(charge);
        return ResponseEntity.ok(ApiResponse.success(null, "Charge deleted"));
    }

    @Data
    public static class ChargeRequest {
        @NotBlank(message = "Name is required")
        private String name;
        private String description, id, currency;
        private BigDecimal price;
        private Boolean taxable;
    }
}
