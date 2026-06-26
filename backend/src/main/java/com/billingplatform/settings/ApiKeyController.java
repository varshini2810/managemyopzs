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

@Repository
interface ApiKeyRepository extends JpaRepository<ApiKey, String> {
    @Query("SELECT k FROM ApiKey k WHERE k.deletedAt IS NULL ORDER BY k.createdAt DESC")
    List<ApiKey> findAllActive();
    Optional<ApiKey> findByIdAndDeletedAtIsNull(String id);
}

// ============ Controller ============
@RestController
@RequestMapping("/api/settings/api-keys")
@RequiredArgsConstructor
public class ApiKeyController {

    private final ApiKeyRepository repository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_SECURITY_VIEW')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<ApiKey>>> list() {
        return ResponseEntity.ok(ApiResponse.success(repository.findAllActive()));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_SECURITY_CREATE')")
    @PostMapping
    public ResponseEntity<ApiResponse<java.util.Map<String, Object>>> create(@Valid @RequestBody ApiKeyRequest req) {
        String rawKey = "bp_live_" + UUID.randomUUID().toString().replace("-", "");
        String prefix = rawKey.substring(0, 12);
        String keyHash = encoder.encode(rawKey);
        ApiKey key = ApiKey.builder()
                .id(UUID.randomUUID().toString())
                .name(req.getName())
                .keyPrefix(prefix)
                .keyHash(keyHash)
                .permissions(req.getPermissions())
                .createdAt(LocalDateTime.now())
                .build();
        repository.save(key);
        // Return raw key only once
        return ResponseEntity.ok(ApiResponse.success(
                java.util.Map.of("id", key.getId(), "name", key.getName(),
                        "keyPrefix", prefix, "rawKey", rawKey,
                        "message", "Copy this key now — it won't be shown again"),
                "API key created"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_SECURITY_DELETE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> revoke(@PathVariable String id) {
        ApiKey key = repository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("ApiKey", id));
        key.setStatus(ApiKey.Status.revoked);
        key.softDelete();
        repository.save(key);
        return ResponseEntity.ok(ApiResponse.success(null, "API key revoked"));
    }

    @Data static class ApiKeyRequest {
        @NotBlank private String name;
        private String permissions;
    }
}
