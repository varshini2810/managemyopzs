package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.WinbackCampaign;
import com.billingplatform.service.WinbackCampaignService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/winbackcampaigns")
public class WinbackCampaignController {
    @Autowired
    private WinbackCampaignService service;

    @GetMapping
    public List<WinbackCampaign> getAll() { return service.findAll(); }
    @PostMapping
    public WinbackCampaign create(@RequestBody WinbackCampaign entity) { return service.save(entity); }
}
