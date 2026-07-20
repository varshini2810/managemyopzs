package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.IpAllowlist;
import com.billingplatform.repository.IpAllowlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class IpAllowlistService {
    @Autowired
    private IpAllowlistRepository repository;

    public List<IpAllowlist> findAll() { return repository.findAll(); }
    public IpAllowlist save(IpAllowlist entity) { return repository.save(entity); }
}
