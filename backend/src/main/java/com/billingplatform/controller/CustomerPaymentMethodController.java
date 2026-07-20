package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.CustomerPaymentMethod;
import com.billingplatform.service.CustomerPaymentMethodService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/customerpaymentmethods")
public class CustomerPaymentMethodController {
    @Autowired
    private CustomerPaymentMethodService service;

    @GetMapping
    public List<CustomerPaymentMethod> getAll() { return service.findAll(); }
    @PostMapping
    public CustomerPaymentMethod create(@RequestBody CustomerPaymentMethod entity) { return service.save(entity); }
}
