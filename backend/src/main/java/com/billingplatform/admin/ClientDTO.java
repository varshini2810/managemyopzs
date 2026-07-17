package com.billingplatform.admin;

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
