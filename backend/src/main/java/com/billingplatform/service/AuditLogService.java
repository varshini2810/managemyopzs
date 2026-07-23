package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.AuditLog;
import com.billingplatform.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class AuditLogService {
    @Autowired
    private AuditLogRepository repository;

    public List<AuditLog> findAll() { return repository.findAll(); }
    public AuditLog save(AuditLog entity) { return repository.save(entity); }
}
