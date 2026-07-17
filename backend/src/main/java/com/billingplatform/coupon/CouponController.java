package com.billingplatform.coupon;


import org.springframework.security.access.prepost.PreAuthorize;
import com.billingplatform.common.ApiResponse;
import com.billingplatform.common.ResourceNotFoundException;
import com.billingplatform.common.SlugUtils;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponRepository couponRepository;

    @PreAuthorize("@accessControl.hasPermission(null, 'COUPON_VIEW')")
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> list(
            @RequestParam(defaultValue = "active") String status,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Coupon> result = couponRepository.findAllFiltered(status, search, pageable);
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "content", result.getContent(),
                "totalElements", result.getTotalElements(),
                "totalPages", result.getTotalPages()
        )));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'COUPON_VIEW')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Coupon>> getOne(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(
                couponRepository.findByIdAndDeletedAtIsNull(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Coupon", id))));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'COUPON_CREATE')")
    @PostMapping
    public ResponseEntity<ApiResponse<Coupon>> create(@Valid @RequestBody CouponRequest req) {
        String id = (req.getId() != null && !req.getId().isBlank()) ? req.getId() : SlugUtils.toSlug(req.getName());
        Coupon coupon = buildCoupon(id, req);
        return ResponseEntity.ok(ApiResponse.success(couponRepository.save(coupon), "Coupon created"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'COUPON_EDIT')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Coupon>> update(@PathVariable String id, @Valid @RequestBody CouponRequest req) {
        couponRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", id));
        Coupon coupon = buildCoupon(id, req);
        return ResponseEntity.ok(ApiResponse.success(couponRepository.save(coupon), "Coupon updated"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'COUPON_DELETE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        Coupon coupon = couponRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", id));
        coupon.softDelete(); couponRepository.save(coupon);
        return ResponseEntity.ok(ApiResponse.success(null, "Coupon deleted"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'COUPON_CREATE')")
    @PostMapping("/{id}/clone")
    public ResponseEntity<ApiResponse<Coupon>> clone(@PathVariable String id) {
        Coupon original = couponRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", id));
        Coupon clone = Coupon.builder()
                .id(original.getId() + "-clone-" + UUID.randomUUID().toString().substring(0, 6))
                .name(original.getName() + " (Copy)")
                .invoiceName(original.getInvoiceName())
                .discountType(original.getDiscountType())
                .discountValue(original.getDiscountValue())
                .applyOn(original.getApplyOn())
                .durationType(original.getDurationType())
                .durationValue(original.getDurationValue())
                .durationUnit(original.getDurationUnit())
                .maxRedemptions(original.getMaxRedemptions())
                .build();
        return ResponseEntity.ok(ApiResponse.success(couponRepository.save(clone), "Coupon cloned"));
    }

    private Coupon buildCoupon(String id, CouponRequest req) {
        return Coupon.builder()
                .id(id)
                .name(req.getName())
                .invoiceName(req.getInvoiceName())
                .discountType(Coupon.DiscountType.valueOf(req.getDiscountType()))
                .discountValue(req.getDiscountValue() != null ? req.getDiscountValue() : BigDecimal.ZERO)
                .applyOn(req.getApplyOn() != null ? Coupon.ApplyOn.valueOf(req.getApplyOn()) : Coupon.ApplyOn.invoice_amount)
                .durationType(req.getDurationType() != null ? Coupon.DurationType.valueOf(req.getDurationType()) : Coupon.DurationType.one_time)
                .durationValue(req.getDurationValue())
                .durationUnit(req.getDurationUnit() != null ? Coupon.DurationUnit.valueOf(req.getDurationUnit()) : null)
                .validTill(req.getValidTill())
                .maxRedemptions(req.getMaxRedemptions())
                .invoiceNote(req.getInvoiceNote())
                .build();
    }

    @Data
    public static class CouponRequest {
        @NotBlank(message = "Name is required")
        private String name;
        private String id, invoiceName, invoiceNote, applyOn, durationType, durationUnit;
        @NotBlank(message = "Discount type is required")
        private String discountType;
        private BigDecimal discountValue;
        private Integer durationValue, maxRedemptions;
        private LocalDateTime validTill;
    }
}

@Repository
interface CouponRepository extends JpaRepository<Coupon, String> {
    @Query("SELECT c FROM Coupon c WHERE c.deletedAt IS NULL AND (:status = '' OR c.status = com.billingplatform.coupon.Coupon$Status.active) AND (LOWER(c.name) LIKE LOWER(CONCAT('%',:search,'%')) OR LOWER(c.id) LIKE LOWER(CONCAT('%',:search,'%')))")
    Page<Coupon> findAllFiltered(String status, String search, Pageable pageable);
    Optional<Coupon> findByIdAndDeletedAtIsNull(String id);
}
