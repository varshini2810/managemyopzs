package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.ARCollectionsQueue;
import com.billingplatform.service.ARCollectionsQueueService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/arcollectionsqueues")
public class ARCollectionsQueueController {
    @Autowired
    private ARCollectionsQueueService service;

    @GetMapping
    public List<ARCollectionsQueue> getAll() { return service.findAll(); }
    @PostMapping
    public ARCollectionsQueue create(@RequestBody ARCollectionsQueue entity) { return service.save(entity); }
}
