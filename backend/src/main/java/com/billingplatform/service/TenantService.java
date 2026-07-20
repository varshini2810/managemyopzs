package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.Tenant;
import com.billingplatform.repository.TenantRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class TenantService {
    @Autowired
    private TenantRepository repository;

    public List<Tenant> findAll() { return repository.findAll(); }
    public Tenant save(Tenant entity) { return repository.save(entity); }
}
