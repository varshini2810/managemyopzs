package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.GatewayHealthLog;
import com.billingplatform.service.GatewayHealthLogService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/gatewayhealthlogs")
public class GatewayHealthLogController {
    @Autowired
    private GatewayHealthLogService service;

    @GetMapping
    public List<GatewayHealthLog> getAll() { return service.findAll(); }
    @PostMapping
    public GatewayHealthLog create(@RequestBody GatewayHealthLog entity) { return service.save(entity); }
}
