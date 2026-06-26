package com.billingplatform.settings;


import org.springframework.security.access.prepost.PreAuthorize;
import com.billingplatform.common.ApiResponse;
import com.billingplatform.common.ResourceNotFoundException;
import com.billingplatform.common.SlugUtils;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

// ============ TaxConfig Entity ============
@Entity
@Table(name = "tax_config")
@Getter @Setter @NoArgsConstructor
class TaxConfig {
    @Id @Column(name = "id") private Integer id = 1;
    @Enumerated(EnumType.STRING)
    @Column(name = "price_type", columnDefinition = "VARCHAR(50)") private PriceType priceType = PriceType.exclusive;
    @Column(name = "collect_tax_id") private Boolean collectTaxId = false;
    @Column(name = "updated_at") private LocalDateTime updatedAt;
    public enum PriceType { exclusive, inclusive }
}

@Repository
interface TaxConfigRepository extends JpaRepository<TaxConfig, Integer> {}

// ============ TaxRegion Entity ============
@Entity
@Table(name = "tax_regions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
class TaxRegion {
    @Id @Column(name = "id", length = 100) private String id;
    @Column(name = "country", nullable = false, length = 2) private String country;
    @Column(name = "state") private String state;
    @Column(name = "tax_name", nullable = false) private String taxName;
    @Column(name = "tax_rate", nullable = false, precision = 5, scale = 2) private BigDecimal taxRate;
    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "VARCHAR(50)") @Builder.Default private Status status = Status.active;
    @Column(name = "created_at") private LocalDateTime createdAt;
    @Column(name = "updated_at") private LocalDateTime updatedAt;
    @Column(name = "deleted_at") private LocalDateTime deletedAt;
    public void softDelete() { this.deletedAt = LocalDateTime.now(); }
    public enum Status { active, inactive }
}

@Repository
interface TaxRegionRepository extends JpaRepository<TaxRegion, String> {
    @Query("SELECT r FROM TaxRegion r WHERE r.deletedAt IS NULL ORDER BY r.country ASC")
    List<TaxRegion> findAllActive();
    Optional<TaxRegion> findByIdAndDeletedAtIsNull(String id);
}

// ============ Tax Controller ============
@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class TaxController {

    private final TaxConfigRepository taxConfigRepository;
    private final TaxRegionRepository taxRegionRepository;

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_CONFIGURE_VIEW')")
    @GetMapping("/tax-config")
    public ResponseEntity<ApiResponse<TaxConfig>> getConfig() {
        return ResponseEntity.ok(ApiResponse.success(
                taxConfigRepository.findById(1).orElse(new TaxConfig())));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_CONFIGURE_EDIT')")
    @PutMapping("/tax-config")
    public ResponseEntity<ApiResponse<TaxConfig>> updateConfig(@RequestBody TaxConfigRequest req) {
        TaxConfig config = taxConfigRepository.findById(1).orElse(new TaxConfig());
        config.setId(1);
        config.setPriceType(TaxConfig.PriceType.valueOf(req.getPriceType()));
        config.setCollectTaxId(Boolean.TRUE.equals(req.getCollectTaxId()));
        config.setUpdatedAt(LocalDateTime.now());
        return ResponseEntity.ok(ApiResponse.success(taxConfigRepository.save(config), "Tax config updated"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_CONFIGURE_VIEW')")
    @GetMapping("/tax-regions")
    public ResponseEntity<ApiResponse<List<TaxRegion>>> listRegions() {
        return ResponseEntity.ok(ApiResponse.success(taxRegionRepository.findAllActive()));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_CONFIGURE_CREATE')")
    @PostMapping("/tax-regions")
    public ResponseEntity<ApiResponse<TaxRegion>> createRegion(@Valid @RequestBody TaxRegionRequest req) {
        String id = "tax-" + req.getCountry().toLowerCase() + "-" + System.currentTimeMillis();
        TaxRegion region = TaxRegion.builder()
                .id(id).country(req.getCountry()).state(req.getState())
                .taxName(req.getTaxName()).taxRate(req.getTaxRate())
                .createdAt(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(ApiResponse.success(taxRegionRepository.save(region), "Tax region added"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_CONFIGURE_DELETE')")
    @DeleteMapping("/tax-regions/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRegion(@PathVariable String id) {
        TaxRegion region = taxRegionRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("TaxRegion", id));
        region.softDelete(); taxRegionRepository.save(region);
        return ResponseEntity.ok(ApiResponse.success(null, "Tax region deleted"));
    }

    @Data static class TaxConfigRequest { private String priceType; private Boolean collectTaxId; }
    @Data static class TaxRegionRequest {
        @NotBlank private String country, taxName;
        private String state;
        private BigDecimal taxRate;
    }
}
