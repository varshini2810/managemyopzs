package com.billingplatform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.billingplatform.auth.UserRepository;
import com.billingplatform.auth.User;
import com.billingplatform.auth.RoleRepository;
import com.billingplatform.auth.Role;
import com.billingplatform.auth.UserRoleAssignmentRepository;
import com.billingplatform.auth.UserRoleAssignment;
import com.billingplatform.auth.TenantRepository;
import com.billingplatform.auth.Tenant;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
public class BillingPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(BillingPlatformApplication.class, args);
    }


}
