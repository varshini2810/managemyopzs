package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.Payout;
import com.billingplatform.repository.PayoutRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class PayoutService {
    @Autowired
    private PayoutRepository repository;

    public List<Payout> findAll() { return repository.findAll(); }
    public Payout save(Payout entity) { return repository.save(entity); }
}
