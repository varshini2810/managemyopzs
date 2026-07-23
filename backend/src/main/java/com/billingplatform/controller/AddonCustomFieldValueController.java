package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.AddonCustomFieldValue;
import com.billingplatform.service.AddonCustomFieldValueService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/addoncustomfieldvalues")
public class AddonCustomFieldValueController {
    @Autowired
    private AddonCustomFieldValueService service;

    @GetMapping
    public List<AddonCustomFieldValue> getAll() { return service.findAll(); }
    @PostMapping
    public AddonCustomFieldValue create(@RequestBody AddonCustomFieldValue entity) { return service.save(entity); }
}
