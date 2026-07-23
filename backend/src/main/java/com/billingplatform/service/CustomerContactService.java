package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.CustomerContact;
import com.billingplatform.repository.CustomerContactRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class CustomerContactService {
    @Autowired
    private CustomerContactRepository repository;

    public List<CustomerContact> findAll() { return repository.findAll(); }
    public CustomerContact save(CustomerContact entity) { return repository.save(entity); }
}
