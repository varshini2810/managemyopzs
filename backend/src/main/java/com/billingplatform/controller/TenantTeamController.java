package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;

import com.billingplatform.model.User;
import com.billingplatform.repository.UserTokenRepository;
import com.billingplatform.repository.TenantRepository;
import com.billingplatform.repository.UserRoleAssignmentRepository;
import com.billingplatform.repository.RoleRepository;
import com.billingplatform.repository.UserRepository;

import com.billingplatform.dto.ApiResponse;
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
@RequestMapping("/api/tenant/team-members")
@RequiredArgsConstructor
public class TenantTeamController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleAssignmentRepository assignmentRepository;
    private final TenantRepository tenantRepository;
    private final UserTokenRepository userTokenRepository;

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_TEAM_MEMBERS_VIEW')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getTeamMembers() {
        String tenantId = CurrentTenantContext.getTenantId();
        if (tenantId == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("No active tenant context"));
        }
        Tenant tenant = tenantRepository.findById(tenantId).orElseThrow();
        return ResponseEntity.ok(ApiResponse.success(userRepository.findByTenantId(tenantId)));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_TEAM_MEMBERS_CREATE')")
    @PostMapping("/invite")
    public ResponseEntity<ApiResponse<InviteTeamMemberResponse>> inviteTeamMember(@RequestBody InviteTeamMemberRequest req) {
        String tenantId = CurrentTenantContext.getTenantId();
        if (tenantId == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("No active tenant context"));
        }

        Tenant tenant = tenantRepository.findById(tenantId).orElseThrow();
        
        User user = userRepository.findByEmailAndDeletedAtIsNull(req.getEmail()).orElseGet(() -> {
            User newUser = User.builder()
                    .id("usr-" + UUID.randomUUID().toString())
                    .name(req.getName())
                    .email(req.getEmail())
                    .passwordHash("") // No password yet
                    .tenant(tenant)
                    .status(User.Status.INVITED)
                    .build();
            return userRepository.save(newUser);
        });

        Role role = roleRepository.findById(req.getRoleName()).orElseThrow(() -> new RuntimeException("Role not found"));
        if (!role.getScope().equals("tenant")) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Cannot assign platform roles to tenant members"));
        }

        UserRoleAssignment assignment = UserRoleAssignment.builder()
                .id("ura-" + UUID.randomUUID().toString())
                .user(user)
                .tenant(tenant)
                .role(role)
                .build();
        assignmentRepository.save(assignment);

        assignmentRepository.save(assignment);

        String token = UUID.randomUUID().toString();
        UserToken userToken = UserToken.builder()
                .id(token)
                .user(user)
                .type(UserToken.TokenType.INVITATION)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();
        userTokenRepository.save(userToken);

        String inviteLink = "http://localhost:5173/accept-invite?token=" + token;

        return ResponseEntity.ok(ApiResponse.success(new InviteTeamMemberResponse(user, inviteLink), "Team member invited"));
    }

    @Data
    @AllArgsConstructor
    public static class InviteTeamMemberResponse {
        private User user;
        private String inviteLink;
    }

    @Data
    static class InviteTeamMemberRequest {
        private String name;
        private String email;
        private String roleName; // e.g. 'USER' or 'ADMIN'
    }
}
