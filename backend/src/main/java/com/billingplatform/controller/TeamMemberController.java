package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.security.*;
import com.billingplatform.dto.*;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/settings/team-members")
@RequiredArgsConstructor
@org.springframework.transaction.annotation.Transactional
public class TeamMemberController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRoleAssignmentRepository assignmentRepository;
    private final TenantRepository tenantRepository;

    private String getTenantId(Authentication auth) {
        if (auth.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) auth.getPrincipal()).getTenantId();
        }
        return null;
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_TEAM_MEMBERS_VIEW')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<TeamMemberDTO>>> list(Authentication auth) {
        String tenantId = getTenantId(auth);
        List<TeamMemberDTO> dtos = assignmentRepository.findByTenantId(tenantId).stream().map(assignment -> {
            TeamMemberDTO.RoleDTO roleDto = null;
            if (assignment.getRole() != null) {
                roleDto = TeamMemberDTO.RoleDTO.builder().id(assignment.getRole().getName()).build();
            }
            
            TeamMemberDTO.UserDTO userDto = null;
            if (assignment.getUser() != null) {
                userDto = TeamMemberDTO.UserDTO.builder()
                        .name(assignment.getUser().getName())
                        .email(assignment.getUser().getEmail())
                        .status(assignment.getUser().getStatus() != null ? assignment.getUser().getStatus().name() : null)
                        .build();
            }
            
            return TeamMemberDTO.builder()
                    .id(assignment.getId())
                    .grantedModules(assignment.getGrantedModules())
                    .role(roleDto)
                    .user(userDto)
                    .build();
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(dtos));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_TEAM_MEMBERS_CREATE')")
    @PostMapping
    public ResponseEntity<ApiResponse<UserRoleAssignment>> invite(Authentication auth, @Valid @RequestBody InviteRequest req) {
        String tenantId = getTenantId(auth);
        
        if (tenantId == null || tenantId.trim().isEmpty() || "null".equalsIgnoreCase(tenantId)) {
            throw new IllegalArgumentException("Tenant ID cannot be null. Please ensure you have selected a valid tenant.");
        }
        
        Tenant tenant = tenantRepository.findById(tenantId)
            .orElseThrow(() -> new ResourceNotFoundException("Tenant", tenantId));
        
        User user = userRepository.findByEmailAndDeletedAtIsNull(req.getEmail()).orElseGet(() -> {
            User newUser = User.builder()
                    .id(UUID.randomUUID().toString())
                    .name(req.getName())
                    .email(req.getEmail())
                    .passwordHash("tempHash") // Real implementation would send an invite email to set password
                    .build();
            return userRepository.save(newUser);
        });

        if (req.getRole() == null || req.getRole().trim().isEmpty()) {
            throw new IllegalArgumentException("Role cannot be null. Please select a valid role.");
        }

        Role role = roleRepository.findById(req.getRole())
            .orElseThrow(() -> new ResourceNotFoundException("Role", req.getRole()));
        UserRoleAssignment assignment = UserRoleAssignment.builder()
                .id(UUID.randomUUID().toString())
                .user(user)
                .tenant(tenant)
                .role(role)
                .build();
                
        return ResponseEntity.ok(ApiResponse.success(assignmentRepository.save(assignment), "Member invited"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_TEAM_MEMBERS_EDIT')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserRoleAssignment>> updateRole(@PathVariable String id, @Valid @RequestBody UpdateRequest req) {
        UserRoleAssignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment", id));
        Role role = roleRepository.findById(req.getRole()).orElseThrow();
        assignment.setRole(role);
        return ResponseEntity.ok(ApiResponse.success(assignmentRepository.save(assignment), "Role updated"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_TEAM_MEMBERS_DELETE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        UserRoleAssignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment", id));
        assignmentRepository.delete(assignment);
        return ResponseEntity.ok(ApiResponse.success(null, "Member removed from tenant"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_TEAM_MEMBERS_EDIT')")
    @PutMapping("/{id}/modules")
    public ResponseEntity<ApiResponse<UserRoleAssignment>> assignModules(@PathVariable String id, @Valid @RequestBody ModulesRequest req) {
        UserRoleAssignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment", id));
                
        if (!"ADMIN".equals(assignment.getRole().getName())) {
            throw new com.billingplatform.exception.BusinessException("Modules can only be customized for ADMIN roles");
        }

        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            assignment.setGrantedModules(mapper.writeValueAsString(req.getModules()));
        } catch (Exception e) {
            throw new RuntimeException("Failed to save modules");
        }
        
        return ResponseEntity.ok(ApiResponse.success(assignmentRepository.save(assignment), "Modules updated"));
    }

    @Data static class InviteRequest {
        private String name;
        private String email;
        private String role; // SUPERADMIN, ADMIN, USER
    }
    
    @Data static class UpdateRequest { 
        private String role; 
    }
    
    @Data static class ModulesRequest {
        private List<String> modules;
    }
}

