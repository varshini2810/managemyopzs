package com.billingplatform.dto;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TeamMemberDTO {
    private String id;
    private String grantedModules;
    private RoleDTO role;
    private UserDTO user;

    @Data
    @Builder
    public static class RoleDTO {
        private String id;
    }

    @Data
    @Builder
    public static class UserDTO {
        private String name;
        private String email;
        private String status;
    }
}
