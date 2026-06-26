package com.billingplatform.notifications;

import com.billingplatform.auth.CurrentTenantContext;
import com.billingplatform.common.ApiResponse;
import com.billingplatform.common.ResourceNotFoundException;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

// ============ EmailTemplate Entity ============
@Entity
@Table(name = "email_templates")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
class EmailTemplate {
    @Id @Column(name = "id") private String id;
    @Column(name = "tenant_id", nullable = false) private String tenantId;
    
    @Column(name = "category", nullable = false) private String category;
    @Column(name = "name", nullable = false) private String name;
    @Column(name = "subject", nullable = false) private String subject;
    
    @Column(name = "sender_name") private String senderName;
    @Column(name = "sender_email") private String senderEmail;
    
    @Column(name = "body", columnDefinition = "TEXT") private String body;
    @Column(name = "status") private Boolean status = true; // active or inactive
    
    @Column(name = "version") private Integer version = 1;
    
    @Column(name = "created_at") private LocalDateTime createdAt;
    @Column(name = "updated_at") private LocalDateTime updatedAt;
}

@Repository
interface EmailTemplateRepository extends JpaRepository<EmailTemplate, String> {
    List<EmailTemplate> findByTenantIdAndCategory(String tenantId, String category);
    List<EmailTemplate> findByTenantId(String tenantId);
}

// ============ EmailTemplateAuditLog Entity ============
@Entity
@Table(name = "email_template_audit_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
class EmailTemplateAuditLog {
    @Id @Column(name = "id") private String id;
    @Column(name = "template_id", nullable = false) private String templateId;
    @Column(name = "tenant_id", nullable = false) private String tenantId;
    @Column(name = "user_id") private String userId; // who made the change
    
    @Column(name = "action") private String action; // CREATED, UPDATED, DELETED
    @Column(name = "previous_body", columnDefinition = "TEXT") private String previousBody;
    @Column(name = "new_body", columnDefinition = "TEXT") private String newBody;
    
    @Column(name = "version") private Integer version;
    @Column(name = "created_at") private LocalDateTime createdAt;
}

@Repository
interface EmailTemplateAuditLogRepository extends JpaRepository<EmailTemplateAuditLog, String> {
    List<EmailTemplateAuditLog> findByTemplateIdOrderByCreatedAtDesc(String templateId);
}

// ============ Email Template Controller ============
@RestController
@RequestMapping("/api/email-templates")
@RequiredArgsConstructor
public class EmailTemplateController {

    private final EmailTemplateRepository emailTemplateRepository;
    private final EmailTemplateAuditLogRepository emailTemplateAuditLogRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ULTRASUPERADMIN', 'SUPERADMIN', 'Tenant Admin')")
    public ResponseEntity<ApiResponse<List<EmailTemplate>>> getAllTemplates(
            @RequestParam(required = false) String category) {
        String tenantId = CurrentTenantContext.getTenantId();
        List<EmailTemplate> templates;
        if (category != null && !category.isEmpty()) {
            templates = emailTemplateRepository.findByTenantIdAndCategory(tenantId, category);
        } else {
            templates = emailTemplateRepository.findByTenantId(tenantId);
        }
        return ResponseEntity.ok(ApiResponse.success(templates));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ULTRASUPERADMIN', 'SUPERADMIN', 'Tenant Admin')")
    public ResponseEntity<ApiResponse<EmailTemplate>> createTemplate(@Valid @RequestBody EmailTemplateRequest req) {
        String tenantId = CurrentTenantContext.getTenantId();
        String userId = CurrentTenantContext.getUserId();

        EmailTemplate template = EmailTemplate.builder()
                .id(UUID.randomUUID().toString())
                .tenantId(tenantId)
                .category(req.getCategory())
                .name(req.getName())
                .subject(req.getSubject())
                .senderName(req.getSenderName())
                .senderEmail(req.getSenderEmail())
                .body(req.getBody())
                .status(req.getStatus() != null ? req.getStatus() : true)
                .version(1)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        EmailTemplate saved = emailTemplateRepository.save(template);

        logAudit(saved.getId(), tenantId, userId, "CREATED", null, saved.getBody(), saved.getVersion());

        return ResponseEntity.ok(ApiResponse.success(saved, "Email template created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ULTRASUPERADMIN', 'SUPERADMIN', 'Tenant Admin')")
    public ResponseEntity<ApiResponse<EmailTemplate>> updateTemplate(
            @PathVariable String id, @Valid @RequestBody EmailTemplateRequest req) {
        String tenantId = CurrentTenantContext.getTenantId();
        String userId = CurrentTenantContext.getUserId();

        EmailTemplate template = emailTemplateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EmailTemplate", id));

        // Ensure tenant isolation
        if (!template.getTenantId().equals(tenantId)) {
            throw new ResourceNotFoundException("EmailTemplate", id);
        }

        String oldBody = template.getBody();
        boolean bodyChanged = !oldBody.equals(req.getBody());

        template.setCategory(req.getCategory());
        template.setName(req.getName());
        template.setSubject(req.getSubject());
        template.setSenderName(req.getSenderName());
        template.setSenderEmail(req.getSenderEmail());
        template.setBody(req.getBody());
        
        if (req.getStatus() != null) {
            template.setStatus(req.getStatus());
        }

        if (bodyChanged) {
            template.setVersion(template.getVersion() + 1);
        }
        template.setUpdatedAt(LocalDateTime.now());

        EmailTemplate updated = emailTemplateRepository.save(template);

        if (bodyChanged) {
            logAudit(updated.getId(), tenantId, userId, "UPDATED", oldBody, updated.getBody(), updated.getVersion());
        }

        return ResponseEntity.ok(ApiResponse.success(updated, "Email template updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ULTRASUPERADMIN', 'SUPERADMIN', 'Tenant Admin')")
    public ResponseEntity<ApiResponse<Void>> deleteTemplate(@PathVariable String id) {
        String tenantId = CurrentTenantContext.getTenantId();
        String userId = CurrentTenantContext.getUserId();

        EmailTemplate template = emailTemplateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EmailTemplate", id));

        if (!template.getTenantId().equals(tenantId)) {
            throw new ResourceNotFoundException("EmailTemplate", id);
        }

        logAudit(template.getId(), tenantId, userId, "DELETED", template.getBody(), null, template.getVersion());
        
        emailTemplateRepository.delete(template);
        return ResponseEntity.ok(ApiResponse.success(null, "Email template deleted"));
    }
    
    @GetMapping("/{id}/audit-logs")
    @PreAuthorize("hasAnyRole('ULTRASUPERADMIN', 'SUPERADMIN', 'Tenant Admin')")
    public ResponseEntity<ApiResponse<List<EmailTemplateAuditLog>>> getAuditLogs(@PathVariable String id) {
        String tenantId = CurrentTenantContext.getTenantId();
        EmailTemplate template = emailTemplateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EmailTemplate", id));

        if (!template.getTenantId().equals(tenantId)) {
            throw new ResourceNotFoundException("EmailTemplate", id);
        }

        List<EmailTemplateAuditLog> logs = emailTemplateAuditLogRepository.findByTemplateIdOrderByCreatedAtDesc(id);
        return ResponseEntity.ok(ApiResponse.success(logs));
    }

    private void logAudit(String templateId, String tenantId, String userId, String action, String oldBody, String newBody, Integer version) {
        EmailTemplateAuditLog log = EmailTemplateAuditLog.builder()
                .id(UUID.randomUUID().toString())
                .templateId(templateId)
                .tenantId(tenantId)
                .userId(userId)
                .action(action)
                .previousBody(oldBody)
                .newBody(newBody)
                .version(version)
                .createdAt(LocalDateTime.now())
                .build();
        emailTemplateAuditLogRepository.save(log);
    }

    @Data static class EmailTemplateRequest {
        @NotBlank private String category;
        @NotBlank private String name;
        @NotBlank private String subject;
        private String senderName;
        private String senderEmail;
        @NotBlank private String body;
        private Boolean status;
    }
}
