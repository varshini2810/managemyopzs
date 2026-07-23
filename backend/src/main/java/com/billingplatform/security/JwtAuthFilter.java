package com.billingplatform.security;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;

import com.billingplatform.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final org.springframework.context.ApplicationContext applicationContext;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        final String userEmail;

        try {
            userEmail = jwtService.extractUsername(jwt);
        } catch (Exception e) {
            filterChain.doFilter(request, response);
            return;
        }

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            io.jsonwebtoken.Claims claims = jwtService.extractAllClaims(jwt);
            String userId = claims.get("userId", String.class);
            String tenantId = claims.get("tenantId", String.class);
            String role = claims.get("role", String.class);
            
            if ("ULTRASUPERADMIN".equalsIgnoreCase(role)) {
                String headerTenantId = request.getHeader("X-Tenant-ID");
                if (headerTenantId != null && !headerTenantId.trim().isEmpty() && !headerTenantId.equalsIgnoreCase("null")) {
                    tenantId = headerTenantId;
                }
            }

            java.util.List<String> permissions = claims.get("permissions", java.util.List.class);
            java.util.List<String> grantedModules = claims.get("grantedModules", java.util.List.class);

            CustomUserDetails userDetails = new CustomUserDetails(userId, userEmail, "", tenantId, role, permissions, grantedModules);
            
            if (!jwtService.isTokenValid(jwt, userDetails)) {
                filterChain.doFilter(request, response);
                return;
            }

            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities()
            );
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
            
            CurrentTenantContext.setUserId(userId);
            if (tenantId != null && !tenantId.trim().isEmpty() && !tenantId.equalsIgnoreCase("null") && !tenantId.equalsIgnoreCase("PLATFORM")) {
                CurrentTenantContext.setTenantId(tenantId);
                CurrentTenantContext.setIsPlatformStaff(false);
            } else {
                CurrentTenantContext.clearTenantId();
                CurrentTenantContext.setIsPlatformStaff(true);
            }
        }
        try {
            filterChain.doFilter(request, response);
        } finally {
            CurrentTenantContext.clear();
        }
    }
}
