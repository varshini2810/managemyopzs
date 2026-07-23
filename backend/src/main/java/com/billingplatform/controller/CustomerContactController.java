package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.CustomerContact;
import com.billingplatform.service.CustomerContactService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/customercontacts")
public class CustomerContactController {
    @Autowired
    private CustomerContactService service;

    @GetMapping
    public List<CustomerContact> getAll() { return service.findAll(); }
    @PostMapping
    public CustomerContact create(@RequestBody CustomerContact entity) { return service.save(entity); }
}
