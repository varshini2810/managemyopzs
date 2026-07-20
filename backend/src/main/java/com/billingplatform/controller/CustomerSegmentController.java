package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.CustomerSegment;
import com.billingplatform.service.CustomerSegmentService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/customersegments")
public class CustomerSegmentController {
    @Autowired
    private CustomerSegmentService service;

    @GetMapping
    public List<CustomerSegment> getAll() { return service.findAll(); }
    @PostMapping
    public CustomerSegment create(@RequestBody CustomerSegment entity) { return service.save(entity); }
}
