package com.billingplatform.auth;

import com.billingplatform.common.ApiResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/tenants")
@RequiredArgsConstructor
public class AdminTenantController {

    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleAssignmentRepository assignmentRepository;
    private final UserTokenRepository userTokenRepository;

    @PreAuthorize("hasRole('ULTRASUPERADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<Tenant>>> listTenants() {
        return ResponseEntity.ok(ApiResponse.success(tenantRepository.findAll()));
    }

    @PreAuthorize("hasRole('ULTRASUPERADMIN')")
    @PostMapping("/invite")
    public ResponseEntity<ApiResponse<InviteTenantResponse>> inviteTenant(@RequestBody InviteTenantRequest req) {
        Tenant tenant = Tenant.builder()
                .id("ten-" + UUID.randomUUID().toString())
                .name(req.getCompanyName())
                .domain(req.getSubdomain())
                .status(Tenant.Status.ACTIVE)
                .isSuspended(false)
                .build();
        tenantRepository.save(tenant);

        User admin = User.builder()
                .id("usr-" + UUID.randomUUID().toString())
                .name("Tenant Admin")
                .email(req.getAdminEmail())
                .passwordHash("") // No password yet
                .tenant(tenant)
                .status(User.Status.INVITED)
                .build();
        userRepository.save(admin);

        Role tenantAdminRole = roleRepository.findById("Admin").orElseThrow();
        UserRoleAssignment assignment = UserRoleAssignment.builder()
                .id("ura-" + UUID.randomUUID().toString())
                .user(admin)
                .tenant(tenant)
                .role(tenantAdminRole)
                .build();
        assignmentRepository.save(assignment);

        String token = UUID.randomUUID().toString();
        UserToken userToken = UserToken.builder()
                .id(token)
                .user(admin)
                .type(UserToken.TokenType.INVITATION)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();
        userTokenRepository.save(userToken);

        String inviteLink = "http://localhost:5173/accept-invite?token=" + token;

        return ResponseEntity.ok(ApiResponse.success(new InviteTenantResponse(tenant, inviteLink), "Tenant invited"));
    }

    @Data
    @AllArgsConstructor
    public static class InviteTenantResponse {
        private Tenant tenant;
        private String inviteLink;
    }

    @Data
    static class TenantRequest {
        private String name;
        private String domain;
    }

    @Data
    static class SuspendRequest {
        private boolean suspended;
    }

    @Data
    static class InviteTenantRequest {
        private String companyName;
        private String subdomain;
        private String adminEmail;
    }
}
