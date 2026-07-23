package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.AtRiskSignal;
import com.billingplatform.service.AtRiskSignalService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/atrisksignals")
public class AtRiskSignalController {
    @Autowired
    private AtRiskSignalService service;

    @GetMapping
    public List<AtRiskSignal> getAll() { return service.findAll(); }
    @PostMapping
    public AtRiskSignal create(@RequestBody AtRiskSignal entity) { return service.save(entity); }
}
