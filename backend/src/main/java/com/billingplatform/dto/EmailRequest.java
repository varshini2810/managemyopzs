package com.billingplatform.dto;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import lombok.Data;

@Data
public class EmailRequest {
    private String to;
    private String subject;
    private String body;
}
