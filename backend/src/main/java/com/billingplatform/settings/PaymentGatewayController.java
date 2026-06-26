package com.billingplatform.settings;


import org.springframework.security.access.prepost.PreAuthorize;
import com.billingplatform.common.ApiResponse;
import com.billingplatform.common.ResourceNotFoundException;
import com.billingplatform.common.SlugUtils;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// ============ Entity ============
@Entity
@Table(name = "payment_gateways")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
class PaymentGateway {
    @Id @Column(name = "id", length = 100)
    private String id;
    @Column(name = "name", nullable = false) private String name;
    @Column(name = "gateway_type", nullable = false) private String gatewayType;
    @Column(name = "api_key") private String apiKey;
    @Column(name = "secret_key") private String secretKey;
    @Column(name = "webhook_secret") private String webhookSecret;
    @Enumerated(EnumType.STRING)
    @Column(name = "mode", columnDefinition = "VARCHAR(50)") @Builder.Default private Mode mode = Mode.test;
    @Column(name = "is_active") @Builder.Default private Boolean isActive = true;
    @Column(name = "supported_currencies", columnDefinition = "JSON") private String supportedCurrencies;
    @Column(name = "logo_url") private String logoUrl;
    @Column(name = "created_at") private java.time.LocalDateTime createdAt;
    @Column(name = "updated_at") private java.time.LocalDateTime updatedAt;
    @Column(name = "deleted_at") private java.time.LocalDateTime deletedAt;
    public void softDelete() { this.deletedAt = java.time.LocalDateTime.now(); }
    public enum Mode { test, live }
}

// ============ Repository ============
@Repository
interface PaymentGatewayRepository extends JpaRepository<PaymentGateway, String> {
    @Query("SELECT g FROM PaymentGateway g WHERE g.deletedAt IS NULL ORDER BY g.createdAt DESC")
    List<PaymentGateway> findAllActive();
    Optional<PaymentGateway> findByIdAndDeletedAtIsNull(String id);
}

// ============ Controller ============
@RestController
@RequestMapping("/api/settings/payment-gateways")
@RequiredArgsConstructor
public class PaymentGatewayController {

    private final PaymentGatewayRepository repository;

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_THIRD_PARTY_VIEW')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentGateway>>> list() {
        return ResponseEntity.ok(ApiResponse.success(repository.findAllActive()));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_THIRD_PARTY_VIEW')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentGateway>> getOne(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(
                repository.findByIdAndDeletedAtIsNull(id)
                        .orElseThrow(() -> new ResourceNotFoundException("PaymentGateway", id))));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_THIRD_PARTY_CREATE')")
    @PostMapping
    public ResponseEntity<ApiResponse<PaymentGateway>> create(@Valid @RequestBody GatewayRequest req) {
        String id = SlugUtils.toSlug(req.getName()) + "-gw";
        PaymentGateway gw = PaymentGateway.builder()
                .id(id).name(req.getName()).gatewayType(req.getGatewayType())
                .apiKey(req.getApiKey()).secretKey(req.getSecretKey())
                .webhookSecret(req.getWebhookSecret())
                .mode(PaymentGateway.Mode.valueOf(req.getMode() != null ? req.getMode() : "test"))
                .isActive(true)
                .createdAt(java.time.LocalDateTime.now())
                .build();
        return ResponseEntity.ok(ApiResponse.success(repository.save(gw), "Gateway added"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_THIRD_PARTY_EDIT')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentGateway>> update(@PathVariable String id, @Valid @RequestBody GatewayRequest req) {
        PaymentGateway gw = repository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("PaymentGateway", id));
        gw.setName(req.getName()); gw.setApiKey(req.getApiKey());
        gw.setSecretKey(req.getSecretKey()); gw.setWebhookSecret(req.getWebhookSecret());
        gw.setIsActive(Boolean.TRUE.equals(req.getIsActive()));
        gw.setUpdatedAt(java.time.LocalDateTime.now());
        return ResponseEntity.ok(ApiResponse.success(repository.save(gw), "Gateway updated"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_THIRD_PARTY_DELETE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        PaymentGateway gw = repository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("PaymentGateway", id));
        gw.softDelete(); repository.save(gw);
        return ResponseEntity.ok(ApiResponse.success(null, "Gateway removed"));
    }

    @Data
    public static class GatewayRequest {
        @NotBlank private String name;
        @NotBlank private String gatewayType;
        private String apiKey, secretKey, webhookSecret, mode;
        private Boolean isActive;
    }
}
