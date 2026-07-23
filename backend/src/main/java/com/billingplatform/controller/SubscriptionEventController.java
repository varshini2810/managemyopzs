package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.SubscriptionEvent;
import com.billingplatform.service.SubscriptionEventService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/subscriptionevents")
public class SubscriptionEventController {
    @Autowired
    private SubscriptionEventService service;

    @GetMapping
    public List<SubscriptionEvent> getAll() { return service.findAll(); }
    @PostMapping
    public SubscriptionEvent create(@RequestBody SubscriptionEvent entity) { return service.save(entity); }
}
