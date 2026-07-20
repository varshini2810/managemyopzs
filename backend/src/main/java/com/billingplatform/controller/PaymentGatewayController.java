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
import com.billingplatform.util.SlugUtils;
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
