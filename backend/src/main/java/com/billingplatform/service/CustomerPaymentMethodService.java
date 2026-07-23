package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.CustomerPaymentMethod;
import com.billingplatform.repository.CustomerPaymentMethodRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class CustomerPaymentMethodService {
    @Autowired
    private CustomerPaymentMethodRepository repository;

    public List<CustomerPaymentMethod> findAll() { return repository.findAll(); }
    public CustomerPaymentMethod save(CustomerPaymentMethod entity) { return repository.save(entity); }
}
