package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.Dispute;
import com.billingplatform.repository.DisputeRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class DisputeService {
    @Autowired
    private DisputeRepository repository;

    public List<Dispute> findAll() { return repository.findAll(); }
    public Dispute save(Dispute entity) { return repository.save(entity); }
}
