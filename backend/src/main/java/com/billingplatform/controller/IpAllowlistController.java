package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.IpAllowlist;
import com.billingplatform.service.IpAllowlistService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/ipallowlists")
public class IpAllowlistController {
    @Autowired
    private IpAllowlistService service;

    @GetMapping
    public List<IpAllowlist> getAll() { return service.findAll(); }
    @PostMapping
    public IpAllowlist create(@RequestBody IpAllowlist entity) { return service.save(entity); }
}
