package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.CustomerCustomFieldValue;
import com.billingplatform.repository.CustomerCustomFieldValueRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class CustomerCustomFieldValueService {
    @Autowired
    private CustomerCustomFieldValueRepository repository;

    public List<CustomerCustomFieldValue> findAll() { return repository.findAll(); }
    public CustomerCustomFieldValue save(CustomerCustomFieldValue entity) { return repository.save(entity); }
}
