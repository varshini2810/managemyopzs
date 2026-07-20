package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.TenantModuleAccess;
import com.billingplatform.service.TenantModuleAccessService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/tenantmoduleaccesss")
public class TenantModuleAccessController {
    @Autowired
    private TenantModuleAccessService service;

    @GetMapping
    public List<TenantModuleAccess> getAll() { return service.findAll(); }
    @PostMapping
    public TenantModuleAccess create(@RequestBody TenantModuleAccess entity) { return service.save(entity); }
}
