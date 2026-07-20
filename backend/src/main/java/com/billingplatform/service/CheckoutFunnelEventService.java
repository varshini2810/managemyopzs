package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.CheckoutFunnelEvent;
import com.billingplatform.repository.CheckoutFunnelEventRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class CheckoutFunnelEventService {
    @Autowired
    private CheckoutFunnelEventRepository repository;

    public List<CheckoutFunnelEvent> findAll() { return repository.findAll(); }
    public CheckoutFunnelEvent save(CheckoutFunnelEvent entity) { return repository.save(entity); }
}
