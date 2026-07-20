package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;

import com.billingplatform.model.ProductFamily;
import com.billingplatform.repository.ProductFamilyRepository;


import org.springframework.security.access.prepost.PreAuthorize;
import com.billingplatform.dto.ApiResponse;
import com.billingplatform.exception.ResourceNotFoundException;
import com.billingplatform.util.SlugUtils;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product-families")
@RequiredArgsConstructor
public class ProductFamilyController {

    private final ProductFamilyRepository repository;

    @PreAuthorize("@accessControl.hasPermission(null, 'PRODUCT_FAMILY_VIEW')")
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> list(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort.Direction dir = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sort));
        Page<ProductFamily> result = repository.findAllActive(search, pageable);

        Map<String, Object> data = Map.of(
                "content", result.getContent(),
                "totalElements", result.getTotalElements(),
                "totalPages", result.getTotalPages(),
                "page", result.getNumber(),
                "size", result.getSize()
        );
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'PRODUCT_FAMILY_VIEW')")
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<ProductFamily>>> listAll() {
        return ResponseEntity.ok(ApiResponse.success(repository.findAllActive()));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'PRODUCT_FAMILY_VIEW')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductFamily>> getOne(@PathVariable String id) {
        ProductFamily pf = repository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProductFamily", id));
        return ResponseEntity.ok(ApiResponse.success(pf));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'PRODUCT_FAMILY_CREATE')")
    @PostMapping
    public ResponseEntity<ApiResponse<ProductFamily>> create(@Valid @RequestBody CreateRequest req) {
        String id = req.getId() != null && !req.getId().isBlank()
                ? req.getId() : SlugUtils.toSlug(req.getName());

        ProductFamily pf = ProductFamily.builder()
                .id(id)
                .name(req.getName())
                .description(req.getDescription())
                .build();
        return ResponseEntity.ok(ApiResponse.success(repository.save(pf), "Product family created"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'PRODUCT_FAMILY_EDIT')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductFamily>> update(
            @PathVariable String id, @Valid @RequestBody CreateRequest req) {
        ProductFamily pf = repository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProductFamily", id));
        pf.setName(req.getName());
        pf.setDescription(req.getDescription());
        return ResponseEntity.ok(ApiResponse.success(repository.save(pf), "Product family updated"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'PRODUCT_FAMILY_DELETE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        ProductFamily pf = repository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProductFamily", id));
        pf.softDelete();
        repository.save(pf);
        return ResponseEntity.ok(ApiResponse.success(null, "Product family deleted"));
    }

    @Data
    public static class CreateRequest {
        @NotBlank(message = "Name is required")
        private String name;
        private String description;
        private String id;
    }
}
