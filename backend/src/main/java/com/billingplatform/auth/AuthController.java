package com.billingplatform.auth;

import com.billingplatform.common.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final LoginAttemptService loginAttemptService;
    private final jakarta.servlet.http.HttpServletRequest httpServletRequest;
    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@Valid @RequestBody LoginRequest request) {
        String clientIp = "unknown"; // In a real app, extract from HttpServletRequest
        String key = request.getEmail() + "-" + clientIp;
        
        if (loginAttemptService.isBlocked(key)) {
            logger.warn("Blocked login attempt for key: {}", key);
            return ResponseEntity.status(429).body(ApiResponse.error("Too many login attempts. Please try again later."));
        }

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            
            // Subdomain resolution logic
            String host = httpServletRequest.getHeader("Host");
            String resolvedTenantId = null;
            if (host != null) {
                String[] parts = host.split("\\.");
                if (parts.length > 1 && !parts[0].equals("www") && !parts[0].equals("localhost")) {
                    String subdomain = parts[0];
                    Optional<Tenant> tenantOpt = tenantRepository.findByDomain(subdomain);
                    if (tenantOpt.isPresent()) {
                        resolvedTenantId = tenantOpt.get().getId();
                    }
                }
            }

            String finalResolvedTenantId = resolvedTenantId;
            User user;
            if (finalResolvedTenantId != null) {
                user = userRepository.findByEmailAndDeletedAtIsNull(request.getEmail())
                        .filter(u -> u.getTenant() != null && u.getTenant().getId().equals(finalResolvedTenantId))
                        .orElseThrow(() -> new org.springframework.security.authentication.BadCredentialsException("Invalid credentials for tenant"));
            } else {
                user = userRepository.findByEmailAndDeletedAtIsNull(request.getEmail()).orElseThrow();
            }
            
            // Update last login
            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);

            loginAttemptService.loginSucceeded(key);

            String accessToken = jwtService.generateToken(userDetails);
            String refreshToken = jwtService.generateRefreshToken(userDetails);

            String roleStr = "USER";
            java.util.List<String> grantedModules = new java.util.ArrayList<>();
            if (userDetails instanceof CustomUserDetails) {
                CustomUserDetails details = (CustomUserDetails) userDetails;
                roleStr = details.getRole().toUpperCase();
                if (details.getGrantedModules() != null) {
                    grantedModules = details.getGrantedModules();
                }
            }

            Map<String, Object> data = Map.of(
                    "accessToken", accessToken,
                    "refreshToken", refreshToken,
                    "user", Map.of(
                            "id", user.getId(),
                            "name", user.getName(),
                            "email", user.getEmail(),
                            "role", roleStr,
                            "grantedModules", grantedModules
                    )
            );

            return ResponseEntity.ok(ApiResponse.success(data, "Login successful"));
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            loginAttemptService.loginFailed(key);
            throw e; // Let GlobalExceptionHandler handle it
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<Map<String, String>>> refresh(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        String email = jwtService.extractUsername(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        if (jwtService.isTokenValid(refreshToken, userDetails)) {
            String newAccessToken = jwtService.generateToken(userDetails);
            return ResponseEntity.ok(ApiResponse.success(Map.of("accessToken", newAccessToken)));
        }
        return ResponseEntity.status(401).body(ApiResponse.error("Invalid refresh token"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmailAndDeletedAtIsNull(email).orElseThrow();
        String roleStr = "USER";
        java.util.List<String> grantedModules = new java.util.ArrayList<>();
        if (authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails details = (CustomUserDetails) authentication.getPrincipal();
            roleStr = details.getRole().toUpperCase();
            if (details.getGrantedModules() != null) {
                grantedModules = details.getGrantedModules();
            }
        }
        Map<String, Object> data = Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", roleStr,
                "status", user.getStatus().name(),
                "grantedModules", grantedModules
        );
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Data
    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;
    }
}
