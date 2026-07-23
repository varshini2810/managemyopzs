package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.JournalEntry;
import com.billingplatform.repository.JournalEntryRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class JournalEntryService {
    @Autowired
    private JournalEntryRepository repository;

    public List<JournalEntry> findAll() { return repository.findAll(); }
    public JournalEntry save(JournalEntry entity) { return repository.save(entity); }
}
