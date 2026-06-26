package com.billingplatform.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final RateLimitFilter rateLimitFilter;
    private final UserRepository userRepository;
    private final com.billingplatform.admin.TenantModuleAccessRepository tenantModuleAccessRepository;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // Security Headers
                .headers(headers -> headers
                        .xssProtection(HeadersConfigurer.XXssConfig::disable)
                        .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'; frame-ancestors 'none'; script-src 'self'"))
                        .frameOptions(HeadersConfigurer.FrameOptionsConfig::deny)
                        .httpStrictTransportSecurity(hsts -> hsts.includeSubDomains(true).maxAgeInSeconds(31536000))
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/api/public/**").permitAll()
                        .requestMatchers("/api/health/**").permitAll()
                        .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                        .requestMatchers("/actuator/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(rateLimitFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            User user = userRepository.findByEmailAndDeletedAtIsNull(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
            
            String tenantId = null;
            String roleStr = "USER";
            java.util.List<String> perms = new java.util.ArrayList<>();
            java.util.List<String> grantedModules = new java.util.ArrayList<>();
            
            if (user.getRoleAssignments() != null && !user.getRoleAssignments().isEmpty()) {
                UserRoleAssignment assignment = user.getRoleAssignments().iterator().next();
                if (assignment.getTenant() != null) {
                    tenantId = assignment.getTenant().getId();
                }
                roleStr = assignment.getRole().getName();
                perms = assignment.getRole().getDefaultPermissions().stream().map(Permission::getPermissionKey).collect(java.util.stream.Collectors.toList());
                if (assignment.getGrantedModules() != null && !assignment.getGrantedModules().isEmpty()) {
                    try {
                        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                        java.util.List<String> userModules = mapper.readValue(assignment.getGrantedModules(), new com.fasterxml.jackson.core.type.TypeReference<java.util.List<String>>(){});
                        grantedModules.addAll(userModules);
                    } catch (Exception e) {
                        // ignore
                    }
                }
            }

            if (tenantId != null) {
                java.util.List<com.billingplatform.admin.TenantModuleAccess> accessList = tenantModuleAccessRepository.findByTenantId(tenantId);
                for (com.billingplatform.admin.TenantModuleAccess access : accessList) {
                    if (access.getGranted()) {
                        // We do not add it to grantedModules, because grantedModules is for user-level overrides.
                        // Or we can add it, but AccessControlService needs to check user-level overrides specifically.
                        // Actually, AccessControlService should probably rely on the user's specific granted modules.
                        // For now, let's keep tenant modules but maybe prepend them or just rely on the ones we parsed above.
                    }
                }
            }

            return new CustomUserDetails(user.getId(), user.getEmail(), user.getPasswordHash(), tenantId, roleStr, perms, grantedModules);
        };
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService());
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Enforce BCrypt strength factor 12+
        return new BCryptPasswordEncoder(12);
    }
}
