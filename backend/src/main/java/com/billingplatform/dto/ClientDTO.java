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
import java.time.LocalDateTime;

@Data
@Builder
public class ClientDTO {
    private String id;
    private String companyName;
    private String subdomain;
    private String status;
    private LocalDateTime createdAt;
    private long numberOfUsers;
    private long modulesGranted;
}
