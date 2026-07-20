package com.billingplatform.dto;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import lombok.Data;
import java.util.List;

@Data
public class CreateClientRequest {
    private String companyName;
    private String subdomain;
    private String businessEmail;
    private String businessPhone;
    private String gstNumber;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String pincode;
    private String country;
    private String industry;
    private String status; // Active, Trial

    private String adminFullName;
    private String adminEmail;

    private List<String> grantedModules; // Format: "suiteKey:moduleKey"
}
