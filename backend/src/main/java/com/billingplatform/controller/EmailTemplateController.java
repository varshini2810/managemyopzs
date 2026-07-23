package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.CurrentTenantContext;
import com.billingplatform.dto.ApiResponse;
import com.billingplatform.exception.ResourceNotFoundException;
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
