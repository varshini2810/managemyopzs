package com.billingplatform.settings;

import com.billingplatform.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/custom-fields")
@RequiredArgsConstructor
public class CustomFieldController {

    private final CustomFieldRepository customFieldRepository;

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_CONFIGURE_VIEW')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<CustomField>>> getCustomFields(@RequestParam String entityType) {
        return ResponseEntity.ok(ApiResponse.success(customFieldRepository.findByEntityTypeAndDeletedAtIsNull(entityType)));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_CONFIGURE_CREATE')")
    @PostMapping
    public ResponseEntity<ApiResponse<CustomField>> createCustomField(@RequestBody CustomField customField) {
        return ResponseEntity.ok(ApiResponse.success(customFieldRepository.save(customField)));
    }
}
