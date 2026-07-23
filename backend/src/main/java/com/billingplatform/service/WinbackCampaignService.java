package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.WinbackCampaign;
import com.billingplatform.repository.WinbackCampaignRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class WinbackCampaignService {
    @Autowired
    private WinbackCampaignRepository repository;

    public List<WinbackCampaign> findAll() { return repository.findAll(); }
    public WinbackCampaign save(WinbackCampaign entity) { return repository.save(entity); }
}
