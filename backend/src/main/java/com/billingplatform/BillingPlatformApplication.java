package com.billingplatform;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.billingplatform.repository.UserRepository;
import com.billingplatform.model.User;
import com.billingplatform.repository.RoleRepository;
import com.billingplatform.model.Role;
import com.billingplatform.repository.UserRoleAssignmentRepository;
import com.billingplatform.model.UserRoleAssignment;
import com.billingplatform.repository.TenantRepository;
import com.billingplatform.model.Tenant;
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


