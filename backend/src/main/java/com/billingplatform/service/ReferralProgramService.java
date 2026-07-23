package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.ReferralProgram;
import com.billingplatform.repository.ReferralProgramRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class ReferralProgramService {
    @Autowired
    private ReferralProgramRepository repository;

    public List<ReferralProgram> findAll() { return repository.findAll(); }
    public ReferralProgram save(ReferralProgram entity) { return repository.save(entity); }
}
