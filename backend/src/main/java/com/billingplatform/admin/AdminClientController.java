package com.billingplatform.admin;

import com.billingplatform.auth.CustomUserDetails;
import com.billingplatform.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/clients")
@RequiredArgsConstructor
public class AdminClientController {

    private final AdminClientService adminClientService;

    @PreAuthorize("hasRole('ULTRASUPERADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<ClientDTO>>> getAllClients() {
        return ResponseEntity.ok(ApiResponse.success(adminClientService.getAllClients()));
    }

    @PreAuthorize("hasRole('ULTRASUPERADMIN')")
    @GetMapping("/{tenantId}")
    public ResponseEntity<ApiResponse<ClientDTO>> getClient(@PathVariable String tenantId) {
        return ResponseEntity.ok(ApiResponse.success(adminClientService.getClient(tenantId)));
    }

    @PreAuthorize("hasRole('ULTRASUPERADMIN')")
    @GetMapping("/{tenantId}/modules")
    public ResponseEntity<ApiResponse<List<String>>> getClientModules(@PathVariable String tenantId) {
        return ResponseEntity.ok(ApiResponse.success(adminClientService.getClientModules(tenantId)));
    }

    @PreAuthorize("hasRole('ULTRASUPERADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, String>>> createClient(@RequestBody CreateClientRequest request, Authentication auth) {
        String grantedBy = ((CustomUserDetails) auth.getPrincipal()).getUserId();
        String tempPassword = adminClientService.createClient(request, grantedBy);
        
        // Return the temp password in response for the UI to display confirmation
        return ResponseEntity.ok(ApiResponse.success(Map.of(
            "message", "Client created successfully",
            "temporaryPassword", tempPassword
        )));
    }

    @PreAuthorize("hasRole('ULTRASUPERADMIN')")
    @PutMapping("/{tenantId}/module-access")
    public ResponseEntity<ApiResponse<Void>> updateModuleAccess(
            @PathVariable String tenantId,
            @RequestBody List<String> grantedModules,
            Authentication auth) {
        String grantedBy = ((CustomUserDetails) auth.getPrincipal()).getUserId();
        adminClientService.updateModuleAccess(tenantId, grantedModules, grantedBy);
        return ResponseEntity.ok(ApiResponse.success(null, "Module access updated"));
    }

    @PreAuthorize("hasRole('ULTRASUPERADMIN')")
    @GetMapping("/check-subdomain")
    public ResponseEntity<ApiResponse<Boolean>> checkSubdomain(@RequestParam String value) {
        return ResponseEntity.ok(ApiResponse.success(adminClientService.isSubdomainAvailable(value)));
    }
}
