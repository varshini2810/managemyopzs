package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.CreditNoteLineItem;
import com.billingplatform.repository.CreditNoteLineItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class CreditNoteLineItemService {
    @Autowired
    private CreditNoteLineItemRepository repository;

    public List<CreditNoteLineItem> findAll() { return repository.findAll(); }
    public CreditNoteLineItem save(CreditNoteLineItem entity) { return repository.save(entity); }
}
