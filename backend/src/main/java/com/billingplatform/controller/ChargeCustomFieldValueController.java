package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.ChargeCustomFieldValue;
import com.billingplatform.service.ChargeCustomFieldValueService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/chargecustomfieldvalues")
public class ChargeCustomFieldValueController {
    @Autowired
    private ChargeCustomFieldValueService service;

    @GetMapping
    public List<ChargeCustomFieldValue> getAll() { return service.findAll(); }
    @PostMapping
    public ChargeCustomFieldValue create(@RequestBody ChargeCustomFieldValue entity) { return service.save(entity); }
}
