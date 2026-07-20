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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

// ============ ApiKey Entity ============
@Entity
@Table(name = "api_keys")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
class ApiKey {
    @Id @Column(name = "id", length = 100) private String id;
    @Column(name = "name", nullable = false) private String name;
    @Column(name = "key_prefix", nullable = false, length = 20) private String keyPrefix;
    @Column(name = "key_hash", nullable = false) private String keyHash;
    @Column(name = "permissions", columnDefinition = "JSON") private String permissions;
    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "VARCHAR(50)") @Builder.Default private Status status = Status.active;
    @Column(name = "last_used_at") private LocalDateTime lastUsedAt;
    @Column(name = "created_at") private LocalDateTime createdAt;
    @Column(name = "updated_at") private LocalDateTime updatedAt;
    @Column(name = "deleted_at") private LocalDateTime deletedAt;
    public void softDelete() { this.deletedAt = LocalDateTime.now(); }
    public enum Status { active, revoked }
}
