package com.billingplatform.settings;

import com.billingplatform.auth.*;
import com.billingplatform.common.ApiResponse;
import com.billingplatform.common.ResourceNotFoundException;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/settings/team-members")
@RequiredArgsConstructor
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
    public ResponseEntity<ApiResponse<List<UserRoleAssignment>>> list(Authentication auth) {
        String tenantId = getTenantId(auth);
        return ResponseEntity.ok(ApiResponse.success(assignmentRepository.findByTenantId(tenantId)));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'SETTINGS_TEAM_MEMBERS_CREATE')")
    @PostMapping
    public ResponseEntity<ApiResponse<UserRoleAssignment>> invite(Authentication auth, @RequestBody InviteRequest req) {
        String tenantId = getTenantId(auth);
        Tenant tenant = tenantRepository.findById(tenantId).orElseThrow();
        
        User user = userRepository.findByEmailAndDeletedAtIsNull(req.getEmail()).orElseGet(() -> {
            User newUser = User.builder()
                    .id(UUID.randomUUID().toString())
                    .name(req.getName())
                    .email(req.getEmail())
                    .passwordHash("tempHash") // Real implementation would send an invite email to set password
                    .build();
            return userRepository.save(newUser);
        });

        Role role = roleRepository.findById(req.getRole()).orElseThrow();
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
    public ResponseEntity<ApiResponse<UserRoleAssignment>> updateRole(@PathVariable String id, @RequestBody UpdateRequest req) {
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
    public ResponseEntity<ApiResponse<UserRoleAssignment>> assignModules(@PathVariable String id, @RequestBody ModulesRequest req) {
        UserRoleAssignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment", id));
                
        if (!"ADMIN".equals(assignment.getRole().getName())) {
            throw new com.billingplatform.common.BusinessException("Modules can only be customized for ADMIN roles");
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
