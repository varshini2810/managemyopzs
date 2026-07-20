package com.billingplatform.exception;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
