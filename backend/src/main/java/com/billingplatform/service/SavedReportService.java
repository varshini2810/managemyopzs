package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.SavedReport;
import com.billingplatform.repository.SavedReportRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class SavedReportService {
    @Autowired
    private SavedReportRepository repository;

    public List<SavedReport> findAll() { return repository.findAll(); }
    public SavedReport save(SavedReport entity) { return repository.save(entity); }
}
