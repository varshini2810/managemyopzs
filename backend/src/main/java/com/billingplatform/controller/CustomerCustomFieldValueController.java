package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.CustomerCustomFieldValue;
import com.billingplatform.service.CustomerCustomFieldValueService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/customercustomfieldvalues")
public class CustomerCustomFieldValueController {
    @Autowired
    private CustomerCustomFieldValueService service;

    @GetMapping
    public List<CustomerCustomFieldValue> getAll() { return service.findAll(); }
    @PostMapping
    public CustomerCustomFieldValue create(@RequestBody CustomerCustomFieldValue entity) { return service.save(entity); }
}
