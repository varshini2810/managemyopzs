package com.billingplatform.auth;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class BootstrapRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleAssignmentRepository userRoleAssignmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${bootstrap-ultrasuperadmin:false}")
    private boolean bootstrapUltrasuperadmin;

    @Override
    public void run(String... args) throws Exception {
        boolean hasBootstrapFlag = false;
        for (String arg : args) {
            if (arg.equals("--bootstrap-ultrasuperadmin")) {
                hasBootstrapFlag = true;
                break;
            }
        }

        if (bootstrapUltrasuperadmin || hasBootstrapFlag) {
            log.info("Running Ultrasuperadmin Bootstrap...");
            
            Optional<User> existingUser = userRepository.findByEmailAndDeletedAtIsNull("admin@billingplatform.com");
            if (existingUser.isPresent()) {
                log.info("Ultrasuperadmin already exists. Skipping bootstrap.");
                return;
            }

            Optional<Role> roleOpt = roleRepository.findById("Ultrasuperadmin");
            if (roleOpt.isEmpty()) {
                log.error("Role 'Ultrasuperadmin' not found. Please ensure Flyway migrations have run.");
                return;
            }

            User admin = User.builder()
                    .id("usr-" + UUID.randomUUID().toString())
                    .name("Platform Ultrasuperadmin")
                    .email("admin@billingplatform.com")
                    .passwordHash(passwordEncoder.encode("TempPass123!"))
                    .status(User.Status.ACTIVE)
                    .build();

            CurrentTenantContext.setIsPlatformStaff(true);
            try {
                userRepository.save(admin);

                UserRoleAssignment assignment = UserRoleAssignment.builder()
                        .id("ura-" + UUID.randomUUID().toString())
                        .user(admin)
                        .role(roleOpt.get())
                        .tenant(null) // Platform scoped
                        .build();

                userRoleAssignmentRepository.save(assignment);
            } finally {
                CurrentTenantContext.clearIsPlatformStaff();
            }


            log.info("Ultrasuperadmin created successfully. Email: admin@billingplatform.com, Password: TempPass123!");
        }
    }
}
