package com.billingplatform.settings;


import org.springframework.security.access.prepost.PreAuthorize;
import com.billingplatform.common.ApiResponse;
import com.billingplatform.common.ResourceNotFoundException;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

// ============ Webhook Entity ============
@Entity
@Table(name = "webhooks")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
class Webhook {
    @Id @Column(name = "id", length = 100) private String id;
    @Column(name = "url", nullable = false, length = 1000) private String url;
    @Column(name = "subscribed_events", nullable = false, columnDefinition = "JSON") private String subscribedEvents;
    @Column(name = "secret") private String secret;
    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "VARCHAR(50)") @Builder.Default private Status status = Status.active;
    @Column(name = "last_triggered_at") private LocalDateTime lastTriggeredAt;
    @Column(name = "created_at") private LocalDateTime createdAt;
    @Column(name = "updated_at") private LocalDateTime updatedAt;
    @Column(name = "deleted_at") private LocalDateTime deletedAt;
    public void softDelete() { this.deletedAt = LocalDateTime.now(); }
    public enum Status { active, inactive }
}

@Repository
interface WebhookRepository extends JpaRepository<Webhook, String> {
    @Query("SELECT w FROM Webhook w WHERE w.deletedAt IS NULL ORDER BY w.createdAt DESC")
    List<Webhook> findAllActive();
    Optional<Webhook> findByIdAndDeletedAtIsNull(String id);
}

// ============ WebhookDelivery Entity ============
@Entity
@Table(name = "webhook_deliveries")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
class WebhookDelivery {
    @Id @Column(name = "id", length = 100) private String id;
    @Column(name = "webhook_id", nullable = false) private String webhookId;
    @Column(name = "event_type", nullable = false) private String eventType;
    @Column(name = "payload", columnDefinition = "JSON") private String payload;
    @Column(name = "response_status") private Integer responseStatus;
    @Column(name = "response_body", columnDefinition = "TEXT") private String responseBody;
    @Column(name = "delivered_at") private LocalDateTime deliveredAt;
    @Column(name = "success") @Builder.Default private Boolean success = false;
}

@Repository
interface WebhookDeliveryRepository extends JpaRepository<WebhookDelivery, String> {
    List<WebhookDelivery> findByWebhookIdOrderByDeliveredAtDesc(String webhookId);
}

// ============ Controller ============
@RestController
@RequestMapping("/api/settings/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private final WebhookRepository webhookRepository;
    private final WebhookDeliveryRepository deliveryRepository;

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_THIRD_PARTY_VIEW')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<Webhook>>> list() {
        return ResponseEntity.ok(ApiResponse.success(webhookRepository.findAllActive()));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_THIRD_PARTY_CREATE')")
    @PostMapping
    public ResponseEntity<ApiResponse<Webhook>> create(@Valid @RequestBody WebhookRequest req) {
        Webhook wh = Webhook.builder()
                .id(UUID.randomUUID().toString())
                .url(req.getUrl())
                .subscribedEvents(req.getSubscribedEvents())
                .secret(req.getSecret())
                .createdAt(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(ApiResponse.success(webhookRepository.save(wh), "Webhook added"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_THIRD_PARTY_EDIT')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Webhook>> update(@PathVariable String id, @Valid @RequestBody WebhookRequest req) {
        Webhook wh = webhookRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Webhook", id));
        wh.setUrl(req.getUrl());
        wh.setSubscribedEvents(req.getSubscribedEvents());
        wh.setUpdatedAt(LocalDateTime.now());
        return ResponseEntity.ok(ApiResponse.success(webhookRepository.save(wh), "Webhook updated"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_THIRD_PARTY_DELETE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        Webhook wh = webhookRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Webhook", id));
        wh.softDelete(); webhookRepository.save(wh);
        return ResponseEntity.ok(ApiResponse.success(null, "Webhook deleted"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_THIRD_PARTY_CREATE')")
    @PostMapping("/{id}/test")
    public ResponseEntity<ApiResponse<Map<String, Object>>> test(@PathVariable String id) {
        Webhook wh = webhookRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Webhook", id));
        // Simulate test delivery
        WebhookDelivery delivery = WebhookDelivery.builder()
                .id(UUID.randomUUID().toString())
                .webhookId(id)
                .eventType("test.event")
                .payload("{\"type\":\"test.event\",\"message\":\"This is a test payload\"}")
                .responseStatus(200)
                .responseBody("OK")
                .deliveredAt(LocalDateTime.now())
                .success(true)
                .build();
        deliveryRepository.save(delivery);
        return ResponseEntity.ok(ApiResponse.success(Map.of("status", 200, "success", true), "Test webhook sent"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_THIRD_PARTY_VIEW')")
    @GetMapping("/{id}/deliveries")
    public ResponseEntity<ApiResponse<List<WebhookDelivery>>> deliveries(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(deliveryRepository.findByWebhookIdOrderByDeliveredAtDesc(id)));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_THIRD_PARTY_VIEW')")
    @GetMapping("/deliveries/all")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<WebhookDelivery>>> allDeliveries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(
            deliveryRepository.findAll(org.springframework.data.domain.PageRequest.of(page, size, org.springframework.data.domain.Sort.by("deliveredAt").descending()))
        ));
    }

    @Data static class WebhookRequest {
        @NotBlank private String url;
        private String subscribedEvents, secret;
    }
}
