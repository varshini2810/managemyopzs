package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.UserRoleAssignment;
import com.billingplatform.service.UserRoleAssignmentService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/userroleassignments")
public class UserRoleAssignmentController {
    @Autowired
    private UserRoleAssignmentService service;

    @GetMapping
    public List<UserRoleAssignment> getAll() { return service.findAll(); }
    @PostMapping
    public UserRoleAssignment create(@RequestBody UserRoleAssignment entity) { return service.save(entity); }
}
