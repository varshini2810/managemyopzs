package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;

import com.billingplatform.model.AccessPreset;
import com.billingplatform.repository.AccessPresetRepository;

import com.billingplatform.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/access-presets")
@RequiredArgsConstructor
public class AdminPresetController {

    private final AccessPresetRepository accessPresetRepository;

    @PreAuthorize("hasRole('ULTRASUPERADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<AccessPreset>>> getPresets() {
        return ResponseEntity.ok(ApiResponse.success(accessPresetRepository.findAll()));
    }

    @PreAuthorize("hasRole('ULTRASUPERADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<AccessPreset>> createPreset(@RequestBody AccessPreset preset) {
        return ResponseEntity.ok(ApiResponse.success(accessPresetRepository.save(preset)));
    }

    @PreAuthorize("hasRole('ULTRASUPERADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePreset(@PathVariable String id) {
        accessPresetRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Preset deleted"));
    }
}
