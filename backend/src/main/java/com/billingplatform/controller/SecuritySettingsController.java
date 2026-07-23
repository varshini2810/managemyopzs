package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.SecuritySettings;
import com.billingplatform.service.SecuritySettingsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/securitysettingss")
public class SecuritySettingsController {
    @Autowired
    private SecuritySettingsService service;

    @GetMapping
    public List<SecuritySettings> getAll() { return service.findAll(); }
    @PostMapping
    public SecuritySettings create(@RequestBody SecuritySettings entity) { return service.save(entity); }
}
