package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.GatewayHealthLog;
import com.billingplatform.repository.GatewayHealthLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class GatewayHealthLogService {
    @Autowired
    private GatewayHealthLogRepository repository;

    public List<GatewayHealthLog> findAll() { return repository.findAll(); }
    public GatewayHealthLog save(GatewayHealthLog entity) { return repository.save(entity); }
}
