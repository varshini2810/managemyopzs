package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.HsnSacCache;
import com.billingplatform.service.HsnSacCacheService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/hsnsaccaches")
public class HsnSacCacheController {
    @Autowired
    private HsnSacCacheService service;

    @GetMapping
    public List<HsnSacCache> getAll() { return service.findAll(); }
    @PostMapping
    public HsnSacCache create(@RequestBody HsnSacCache entity) { return service.save(entity); }
}
