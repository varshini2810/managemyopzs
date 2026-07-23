package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.AtRiskSignal;
import com.billingplatform.repository.AtRiskSignalRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class AtRiskSignalService {
    @Autowired
    private AtRiskSignalRepository repository;

    public List<AtRiskSignal> findAll() { return repository.findAll(); }
    public AtRiskSignal save(AtRiskSignal entity) { return repository.save(entity); }
}
