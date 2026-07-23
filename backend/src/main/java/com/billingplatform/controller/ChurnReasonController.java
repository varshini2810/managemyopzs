package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.ChurnReason;
import com.billingplatform.service.ChurnReasonService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/churnreasons")
public class ChurnReasonController {
    @Autowired
    private ChurnReasonService service;

    @GetMapping
    public List<ChurnReason> getAll() { return service.findAll(); }
    @PostMapping
    public ChurnReason create(@RequestBody ChurnReason entity) { return service.save(entity); }
}
