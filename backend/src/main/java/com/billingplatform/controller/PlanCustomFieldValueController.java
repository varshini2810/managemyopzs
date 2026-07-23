package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.PlanCustomFieldValue;
import com.billingplatform.service.PlanCustomFieldValueService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/plancustomfieldvalues")
public class PlanCustomFieldValueController {
    @Autowired
    private PlanCustomFieldValueService service;

    @GetMapping
    public List<PlanCustomFieldValue> getAll() { return service.findAll(); }
    @PostMapping
    public PlanCustomFieldValue create(@RequestBody PlanCustomFieldValue entity) { return service.save(entity); }
}
