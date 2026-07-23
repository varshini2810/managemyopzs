package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.WriteOff;
import com.billingplatform.service.WriteOffService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/writeoffs")
public class WriteOffController {
    @Autowired
    private WriteOffService service;

    @GetMapping
    public List<WriteOff> getAll() { return service.findAll(); }
    @PostMapping
    public WriteOff create(@RequestBody WriteOff entity) { return service.save(entity); }
}
