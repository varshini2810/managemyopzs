package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.dto.ApiResponse;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.UUID;

// ============ BrandSettings Entity ============
@Entity
@Table(name = "brand_settings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
class BrandSettings {
    @Id @Column(name = "id") private String id = "default";
    @Column(name = "logo_url") private String logoUrl;
    @Column(name = "icon_url") private String iconUrl;
    @Column(name = "favicon_url") private String faviconUrl;
    @Column(name = "accent_color") private String accentColor = "#2196F3";

    @Column(name = "email_branding") private Boolean emailBranding = true;
    @Column(name = "invoice_branding") private Boolean invoiceBranding = true;
    @Column(name = "checkout_branding") private Boolean checkoutBranding = true;
    @Column(name = "portal_branding") private Boolean portalBranding = true;

    @Column(name = "created_at") private LocalDateTime createdAt;
    @Column(name = "updated_at") private LocalDateTime updatedAt;
}
