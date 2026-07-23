package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.ReferralProgram;
import com.billingplatform.service.ReferralProgramService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/referralprograms")
public class ReferralProgramController {
    @Autowired
    private ReferralProgramService service;

    @GetMapping
    public List<ReferralProgram> getAll() { return service.findAll(); }
    @PostMapping
    public ReferralProgram create(@RequestBody ReferralProgram entity) { return service.save(entity); }
}
