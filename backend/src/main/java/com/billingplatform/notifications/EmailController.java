package com.billingplatform.notifications;

import com.billingplatform.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

import com.billingplatform.auth.CurrentTenantContext;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    @PreAuthorize("@accessControl.hasPermission(null, 'LOGS_CREATE')")
    @PostMapping("/send")
    public ResponseEntity<ApiResponse<String>> sendTestEmail(@RequestBody EmailRequest request) {
        // Send email asynchronously
        String tenantId = CurrentTenantContext.getTenantId();
        boolean isPlatformStaff = CurrentTenantContext.isPlatformStaff();
        String userId = CurrentTenantContext.getUserId();
        
        emailService.sendEmail(request.getTo(), request.getSubject(), request.getBody(), tenantId, isPlatformStaff, userId);
        
        return ResponseEntity.ok(ApiResponse.success("Email sending initiated. Check database logs for status."));
    }
}
