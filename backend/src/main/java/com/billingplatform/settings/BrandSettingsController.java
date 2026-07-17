package com.billingplatform.settings;

import com.billingplatform.common.ApiResponse;
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

@Repository
interface BrandSettingsRepository extends JpaRepository<BrandSettings, String> {}

// ============ Brand Settings Controller ============
@RestController
@RequestMapping("/api/configure/brand")
@RequiredArgsConstructor
public class BrandSettingsController {

    private final BrandSettingsRepository brandSettingsRepository;
    private static final String UPLOAD_DIR = "uploads/branding/";

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER', 'SUPERADMIN', 'ULTRASUPERADMIN')")
    public ResponseEntity<ApiResponse<BrandSettings>> getBrandSettings() {
        BrandSettings settings = brandSettingsRepository.findById("default")
                .orElse(BrandSettings.builder().id("default").accentColor("#2196F3").build());
        return ResponseEntity.ok(ApiResponse.success(settings));
    }

    @PutMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN', 'ULTRASUPERADMIN')")
    public ResponseEntity<ApiResponse<BrandSettings>> updateBrandSettings(@RequestBody BrandSettingsRequest req) {
        BrandSettings settings = brandSettingsRepository.findById("default")
                .orElse(BrandSettings.builder().id("default").createdAt(LocalDateTime.now()).build());
        
        settings.setLogoUrl(req.getLogoUrl());
        settings.setIconUrl(req.getIconUrl());
        settings.setFaviconUrl(req.getFaviconUrl());
        settings.setAccentColor(req.getAccentColor());
        settings.setUpdatedAt(LocalDateTime.now());

        return ResponseEntity.ok(ApiResponse.success(brandSettingsRepository.save(settings), "Brand settings updated"));
    }

    @PostMapping("/upload")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN', 'ULTRASUPERADMIN')")
    public ResponseEntity<ApiResponse<String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String fileName = UUID.randomUUID().toString() + extension;
            
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Assuming a simple static file serving from /uploads
            String fileUrl = "/uploads/branding/" + fileName;
            
            return ResponseEntity.ok(ApiResponse.success(fileUrl, "File uploaded successfully"));
        } catch (IOException ex) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Could not upload file: " + ex.getMessage()));
        }
    }

    @Data static class BrandSettingsRequest {
        private String logoUrl;
        private String iconUrl;
        private String faviconUrl;
        private String accentColor;
    }
}
