package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.Permission;
import com.billingplatform.repository.PermissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class PermissionService {
    @Autowired
    private PermissionRepository repository;

    public List<Permission> findAll() { return repository.findAll(); }
    public Permission save(Permission entity) { return repository.save(entity); }
}
