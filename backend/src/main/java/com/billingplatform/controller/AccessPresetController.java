package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.AccessPreset;
import com.billingplatform.service.AccessPresetService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/accesspresets")
public class AccessPresetController {
    @Autowired
    private AccessPresetService service;

    @GetMapping
    public List<AccessPreset> getAll() { return service.findAll(); }
    @PostMapping
    public AccessPreset create(@RequestBody AccessPreset entity) { return service.save(entity); }
}
