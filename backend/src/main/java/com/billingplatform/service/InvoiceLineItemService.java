package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.InvoiceLineItem;
import com.billingplatform.repository.InvoiceLineItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class InvoiceLineItemService {
    @Autowired
    private InvoiceLineItemRepository repository;

    public List<InvoiceLineItem> findAll() { return repository.findAll(); }
    public InvoiceLineItem save(InvoiceLineItem entity) { return repository.save(entity); }
}
