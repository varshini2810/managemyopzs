package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.RetentionActivityLog;
import com.billingplatform.service.RetentionActivityLogService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/retentionactivitylogs")
public class RetentionActivityLogController {
    @Autowired
    private RetentionActivityLogService service;

    @GetMapping
    public List<RetentionActivityLog> getAll() { return service.findAll(); }
    @PostMapping
    public RetentionActivityLog create(@RequestBody RetentionActivityLog entity) { return service.save(entity); }
}
