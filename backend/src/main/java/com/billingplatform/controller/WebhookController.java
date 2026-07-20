package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;



import org.springframework.security.access.prepost.PreAuthorize;
import com.billingplatform.dto.ApiResponse;
import com.billingplatform.exception.ResourceNotFoundException;
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
