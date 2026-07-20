package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.AppIntegration;
import com.billingplatform.repository.AppIntegrationRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class AppIntegrationService {
    @Autowired
    private AppIntegrationRepository repository;

    public List<AppIntegration> findAll() { return repository.findAll(); }
    public AppIntegration save(AppIntegration entity) { return repository.save(entity); }
}
