package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.ContractModification;
import com.billingplatform.repository.ContractModificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class ContractModificationService {
    @Autowired
    private ContractModificationRepository repository;

    public List<ContractModification> findAll() { return repository.findAll(); }
    public ContractModification save(ContractModification entity) { return repository.save(entity); }
}
