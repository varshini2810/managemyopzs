package com.billingplatform.auth;

import com.billingplatform.common.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicAuthController {

    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleAssignmentRepository userRoleAssignmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserTokenRepository userTokenRepository;

    @GetMapping("/check-subdomain")
    public ResponseEntity<ApiResponse<Boolean>> checkSubdomain(@RequestParam String name) {
        boolean exists = tenantRepository.findByDomain(name).isPresent();
        return ResponseEntity.ok(ApiResponse.success(!exists, "Subdomain availability checked"));
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Map<String, String>>> signup(@Valid @RequestBody SignupRequest request) {
        if (tenantRepository.findByDomain(request.getSubdomain()).isPresent()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Subdomain already exists"));
        }

        if (userRepository.findByEmailAndDeletedAtIsNull(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email already in use"));
        }

        Optional<Role> tenantAdminRole = roleRepository.findById("Admin");
        if (tenantAdminRole.isEmpty()) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("System roles not initialized"));
        }

        // Create Tenant
        Tenant tenant = Tenant.builder()
                .id("ten-" + UUID.randomUUID().toString())
                .name(request.getCompanyName())
                .domain(request.getSubdomain())
                .isSuspended(false)
                .build();
        tenantRepository.save(tenant);

        // Create User
        User user = User.builder()
                .id("usr-" + UUID.randomUUID().toString())
                .name("Admin User") // Ideally get from request
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .tenant(tenant)
                .status(User.Status.ACTIVE) // Should be INVITED/VERIFYING, but ACTIVE for brevity as per instructions
                .build();
        userRepository.save(user);

        // Assign Role
        UserRoleAssignment assignment = UserRoleAssignment.builder()
                .id("ura-" + UUID.randomUUID().toString())
                .user(user)
                .role(tenantAdminRole.get())
                .tenant(tenant)
                .build();
        userRoleAssignmentRepository.save(assignment);

        return ResponseEntity.ok(ApiResponse.success(Map.of("tenantId", tenant.getId()), "Signup successful"));
    }

    @PostMapping("/accept-invite")
    public ResponseEntity<ApiResponse<Map<String, String>>> acceptInvite(@Valid @RequestBody AcceptInviteRequest request) {
        Optional<UserToken> tokenOpt = userTokenRepository.findById(request.getToken());
        if (tokenOpt.isEmpty() || tokenOpt.get().getExpiresAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid or expired token"));
        }

        UserToken token = tokenOpt.get();
        User user = token.getUser();
        
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setStatus(User.Status.ACTIVE);
        userRepository.save(user);

        userTokenRepository.delete(token); // Token is one-time use

        return ResponseEntity.ok(ApiResponse.success(Map.of("email", user.getEmail()), "Password set successfully"));
    }

    @Data
    public static class AcceptInviteRequest {
        @NotBlank
        private String token;

        @NotBlank
        private String password;
    }

    @Data
    public static class SignupRequest {
        @NotBlank
        private String companyName;

        @NotBlank
        private String subdomain;

        @NotBlank
        @Email
        private String email;

        @NotBlank
        private String password;
    }
}
