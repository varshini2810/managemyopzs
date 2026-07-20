package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.UserToken;
import com.billingplatform.service.UserTokenService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/usertokens")
public class UserTokenController {
    @Autowired
    private UserTokenService service;

    @GetMapping
    public List<UserToken> getAll() { return service.findAll(); }
    @PostMapping
    public UserToken create(@RequestBody UserToken entity) { return service.save(entity); }
}
