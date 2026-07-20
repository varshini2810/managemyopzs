package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.RetentionActivityLog;
import com.billingplatform.repository.RetentionActivityLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class RetentionActivityLogService {
    @Autowired
    private RetentionActivityLogRepository repository;

    public List<RetentionActivityLog> findAll() { return repository.findAll(); }
    public RetentionActivityLog save(RetentionActivityLog entity) { return repository.save(entity); }
}
