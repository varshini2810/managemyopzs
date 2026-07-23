package com.billingplatform.model;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class CustomUserDetails implements UserDetails {

    private final String userId;
    private final String username;
    private final String password;
    private final String tenantId;
    private final String role;
    private final List<String> permissions;
    private final List<String> grantedModules;

    public CustomUserDetails(String userId, String username, String password, String tenantId, String role, List<String> permissions, List<String> grantedModules) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.tenantId = tenantId;
        this.role = role;
        this.permissions = permissions;
        this.grantedModules = grantedModules;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        java.util.List<GrantedAuthority> authorities = new java.util.ArrayList<>();
        
        // Normalize role name for Spring Security checks
        if (role != null && (
            role.equalsIgnoreCase("ULTRASUPERADMIN") || 
            role.equalsIgnoreCase("Platform Ultrasuperadmin") || 
            role.equalsIgnoreCase("PLATFORM OWNER")
        )) {
            authorities.add(new SimpleGrantedAuthority("ROLE_ULTRASUPERADMIN"));
            authorities.add(new SimpleGrantedAuthority("ROLE_Ultrasuperadmin"));
        } else if (role != null) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));
        }

        if (permissions != null) {
            for (String p : permissions) {
                authorities.add(new SimpleGrantedAuthority(p));
            }
        }
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
