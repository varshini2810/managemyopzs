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
