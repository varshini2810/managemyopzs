package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.Permission;
import com.billingplatform.service.PermissionService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/permissions")
public class PermissionController {
    @Autowired
    private PermissionService service;

    @GetMapping
    public List<Permission> getAll() { return service.findAll(); }
    @PostMapping
    public Permission create(@RequestBody Permission entity) { return service.save(entity); }
}
