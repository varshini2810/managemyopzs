package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.SubscriptionAddon;
import com.billingplatform.repository.SubscriptionAddonRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class SubscriptionAddonService {
    @Autowired
    private SubscriptionAddonRepository repository;

    public List<SubscriptionAddon> findAll() { return repository.findAll(); }
    public SubscriptionAddon save(SubscriptionAddon entity) { return repository.save(entity); }
}
