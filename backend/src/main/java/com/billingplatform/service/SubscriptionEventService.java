package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.SubscriptionEvent;
import com.billingplatform.repository.SubscriptionEventRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class SubscriptionEventService {
    @Autowired
    private SubscriptionEventRepository repository;

    public List<SubscriptionEvent> findAll() { return repository.findAll(); }
    public SubscriptionEvent save(SubscriptionEvent entity) { return repository.save(entity); }
}
