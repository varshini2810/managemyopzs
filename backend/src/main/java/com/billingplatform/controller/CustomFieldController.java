package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;

import com.billingplatform.model.CustomField;
import com.billingplatform.repository.CustomFieldRepository;

import com.billingplatform.dto.ApiResponse;
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
