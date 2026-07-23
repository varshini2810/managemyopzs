package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.InvoiceSequence;
import com.billingplatform.repository.InvoiceSequenceRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class InvoiceSequenceService {
    @Autowired
    private InvoiceSequenceRepository repository;

    public List<InvoiceSequence> findAll() { return repository.findAll(); }
    public InvoiceSequence save(InvoiceSequence entity) { return repository.save(entity); }
}
