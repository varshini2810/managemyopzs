package com.billingplatform.invoice;

import com.billingplatform.auth.CustomUserDetails;
import com.billingplatform.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tax-lookup")
@RequiredArgsConstructor
public class TaxLookupController {

    private final TaxLookupService taxLookupService;

    private String getTenantId(Authentication auth) {
        if (auth.getPrincipal() instanceof CustomUserDetails user) {
            return user.getTenantId();
        }
        throw new RuntimeException("Unauthorized");
    }

    @GetMapping("/hsn")
    @PreAuthorize("hasAnyRole('ULTRASUPERADMIN', 'SUPERADMIN') or hasAuthority('BILLING_READ')")
    public ResponseEntity<ApiResponse<HsnSacCache>> lookupHsn(@RequestParam String query, Authentication auth) {
        String tenantId = getTenantId(auth);
        return ResponseEntity.ok(ApiResponse.success(taxLookupService.lookupHsn(query, tenantId)));
    }

    @GetMapping("/sac")
    @PreAuthorize("hasAnyRole('ULTRASUPERADMIN', 'SUPERADMIN') or hasAuthority('BILLING_READ')")
    public ResponseEntity<ApiResponse<HsnSacCache>> lookupSac(@RequestParam String query, Authentication auth) {
        String tenantId = getTenantId(auth);
        return ResponseEntity.ok(ApiResponse.success(taxLookupService.lookupSac(query, tenantId)));
    }
}
