package com.billingplatform.admin;

import com.billingplatform.common.ApiResponse;
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
