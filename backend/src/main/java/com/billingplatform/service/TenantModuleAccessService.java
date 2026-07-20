package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.TenantModuleAccess;
import com.billingplatform.repository.TenantModuleAccessRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class TenantModuleAccessService {
    @Autowired
    private TenantModuleAccessRepository repository;

    public List<TenantModuleAccess> findAll() { return repository.findAll(); }
    public TenantModuleAccess save(TenantModuleAccess entity) { return repository.save(entity); }
}
