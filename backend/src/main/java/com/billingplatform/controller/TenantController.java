package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.Tenant;
import com.billingplatform.service.TenantService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/tenants")
public class TenantController {
    @Autowired
    private TenantService service;

    @GetMapping
    public List<Tenant> getAll() { return service.findAll(); }
    @PostMapping
    public Tenant create(@RequestBody Tenant entity) { return service.save(entity); }
}
