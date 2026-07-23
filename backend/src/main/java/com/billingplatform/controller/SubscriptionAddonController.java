package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.SubscriptionAddon;
import com.billingplatform.service.SubscriptionAddonService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/subscriptionaddons")
public class SubscriptionAddonController {
    @Autowired
    private SubscriptionAddonService service;

    @GetMapping
    public List<SubscriptionAddon> getAll() { return service.findAll(); }
    @PostMapping
    public SubscriptionAddon create(@RequestBody SubscriptionAddon entity) { return service.save(entity); }
}
