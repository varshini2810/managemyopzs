package com.billingplatform.admin;

import com.billingplatform.auth.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminClientService {

    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleAssignmentRepository userRoleAssignmentRepository;
    private final TenantModuleAccessRepository tenantModuleAccessRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.billingplatform.notifications.EmailService emailService;

    public List<ClientDTO> getAllClients() {
        return tenantRepository.findAll().stream().map(t -> {
            long userCount = userRoleAssignmentRepository.findByTenantId(t.getId()).size();
            long modulesCount = tenantModuleAccessRepository.findByTenantId(t.getId()).size();
            
            return ClientDTO.builder()
                    .id(t.getId())
                    .companyName(t.getName())
                    .subdomain(t.getDomain())
                    .status(t.getDeletedAt() == null ? "Active" : "Suspended")
                    .createdAt(t.getCreatedAt())
                    .numberOfUsers(userCount)
                    .modulesGranted(modulesCount)
                    .build();
        }).collect(Collectors.toList());
    }

    public ClientDTO getClient(String tenantId) {
        Tenant t = tenantRepository.findById(tenantId).orElseThrow(() -> new RuntimeException("Client not found"));
        long userCount = userRoleAssignmentRepository.findByTenantId(t.getId()).size();
        long modulesCount = tenantModuleAccessRepository.findByTenantId(t.getId()).size();

        return ClientDTO.builder()
                .id(t.getId())
                .companyName(t.getName())
                .subdomain(t.getDomain())
                .status(t.getDeletedAt() == null ? "Active" : "Suspended")
                .createdAt(t.getCreatedAt())
                .numberOfUsers(userCount)
                .modulesGranted(modulesCount)
                .build();
    }

    @Transactional
    public String createClient(CreateClientRequest request, String grantedBy) {
        // 1. Create Tenant
        Tenant tenant = new Tenant();
        tenant.setId("ten-" + java.util.UUID.randomUUID().toString());
        tenant.setName(request.getCompanyName());
        tenant.setDomain(request.getSubdomain());
        tenant = tenantRepository.save(tenant);

        // 2. Create User
        String tempPassword = generateRandomPassword();
        User user = new User();
        user.setId("usr-" + java.util.UUID.randomUUID().toString());
        user.setEmail(request.getAdminEmail());
        user.setName(request.getAdminFullName());
        user.setPasswordHash(passwordEncoder.encode(tempPassword));
        user = userRepository.save(user);

        // 3. Assign Role
        Role adminRole = roleRepository.findById("Admin")
                .orElseThrow(() -> new RuntimeException("Admin role not found"));
                
        UserRoleAssignment assignment = new UserRoleAssignment();
        assignment.setUser(user);
        assignment.setTenant(tenant);
        assignment.setRole(adminRole);
        userRoleAssignmentRepository.save(assignment);

        // 4. Save Module Access
        if (request.getGrantedModules() != null) {
            for (String mod : request.getGrantedModules()) {
                String[] parts = mod.split(":");
                if (parts.length == 2) {
                    TenantModuleAccess tma = new TenantModuleAccess();
                    tma.setTenantId(tenant.getId());
                    tma.setSuiteKey(parts[0]);
                    tma.setModuleKey(parts[1]);
                    tma.setGranted(true);
                    tma.setGrantedBy(grantedBy);
                    tenantModuleAccessRepository.save(tma);
                }
            }
        }

        // 5. Send Welcome Email AFTER transaction commits, so the async thread can see the new Tenant row
        String subject = "Welcome to Opz Billing Tool - Your Account Details";
        String body = String.format("Hello %s,\n\nYour admin account for %s has been created.\n\n" +
                "Login URL: http://localhost:5173/login\n" +
                "Email: %s\n" +
                "Temporary Password: %s\n\n" +
                "Please login and change your password immediately.\n\n" +
                "Best regards,\nOpz Billing Team", 
                request.getAdminFullName(), request.getCompanyName(), request.getAdminEmail(), tempPassword);
        
        final String tenantId = tenant.getId();
        
        org.springframework.transaction.support.TransactionSynchronizationManager.registerSynchronization(
            new org.springframework.transaction.support.TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    emailService.sendEmail(request.getAdminEmail(), subject, body, tenantId, true, grantedBy);
                }
            }
        );

        // Return temporary password for sending in UI / email
        return tempPassword;
    }

    @Transactional
    public void updateModuleAccess(String tenantId, List<String> grantedModules, String grantedBy) {
        tenantModuleAccessRepository.deleteByTenantId(tenantId);
        if (grantedModules != null) {
            for (String mod : grantedModules) {
                String[] parts = mod.split(":");
                if (parts.length == 2) {
                    TenantModuleAccess tma = new TenantModuleAccess();
                    tma.setTenantId(tenantId);
                    tma.setSuiteKey(parts[0]);
                    tma.setModuleKey(parts[1]);
                    tma.setGranted(true);
                    tma.setGrantedBy(grantedBy);
                    tenantModuleAccessRepository.save(tma);
                }
            }
        }
    }

    public List<String> getClientModules(String tenantId) {
        return tenantModuleAccessRepository.findByTenantId(tenantId).stream()
                .filter(TenantModuleAccess::getGranted)
                .map(t -> t.getSuiteKey() + ":" + t.getModuleKey())
                .collect(Collectors.toList());
    }

    public boolean isSubdomainAvailable(String subdomain) {
        return !tenantRepository.existsByDomain(subdomain);
    }

    private String generateRandomPassword() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[16];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
