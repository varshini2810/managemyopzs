package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.Customer;
import com.billingplatform.repository.CustomerRepository;
import com.billingplatform.model.Invoice;
import com.billingplatform.repository.InvoiceRepository;
import com.billingplatform.model.Subscription;
import com.billingplatform.repository.SubscriptionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
@Transactional
public class ExportController {

    private final SubscriptionRepository subscriptionRepository;
    private final CustomerRepository customerRepository;
    private final InvoiceRepository invoiceRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<byte[]> exportData(
            @RequestParam String entity,
            @RequestParam String dateRange,
            @RequestParam String format) {

        List<?> data = new ArrayList<>();
        LocalDateTime cutoff = "Last30Days".equalsIgnoreCase(dateRange) ? LocalDateTime.now().minusDays(30) : LocalDateTime.MIN;

        if ("subscriptions".equalsIgnoreCase(entity)) {
            data = subscriptionRepository.findAllWithFilters(null, null, null, PageRequest.of(0, 10000))
                    .getContent().stream()
                    .filter(s -> s.getCreatedAt().isAfter(cutoff))
                    .collect(Collectors.toList());
        } else if ("customers".equalsIgnoreCase(entity)) {
            data = customerRepository.findAllWithFilters(null, null, PageRequest.of(0, 10000))
                    .getContent().stream()
                    .filter(c -> c.getCreatedAt().isAfter(cutoff))
                    .collect(Collectors.toList());
        } else if ("invoices".equalsIgnoreCase(entity)) {
            data = invoiceRepository.findAllWithFilters(null, null, null, PageRequest.of(0, 10000))
                    .getContent().stream()
                    .filter(i -> i.getCreatedAt().isAfter(cutoff))
                    .collect(Collectors.toList());
        } else {
            return ResponseEntity.badRequest().body("Unsupported entity type".getBytes());
        }

        if (data.isEmpty()) {
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(new byte[0]);
        }

        try {
            if ("csv".equalsIgnoreCase(format)) {
                StringBuilder csv = new StringBuilder();
                if ("subscriptions".equalsIgnoreCase(entity)) {
                    csv.append("ID,Status,Customer ID,Created At\n");
                    for (Object obj : data) {
                        Subscription s = (Subscription) obj;
                        csv.append(String.format("%s,%s,%s,%s\n", s.getId(), s.getStatus(), s.getCustomerId(), s.getCreatedAt()));
                    }
                } else if ("customers".equalsIgnoreCase(entity)) {
                    csv.append("ID,Name,Email,Status,Created At\n");
                    for (Object obj : data) {
                        Customer c = (Customer) obj;
                        csv.append(String.format("%s,%s %s,%s,%s,%s\n", c.getId(), c.getFirstName(), c.getLastName(), c.getEmail(), c.getStatus(), c.getCreatedAt()));
                    }
                } else if ("invoices".equalsIgnoreCase(entity)) {
                    csv.append("ID,Customer ID,Status,Amount Due,Created At\n");
                    for (Object obj : data) {
                        Invoice i = (Invoice) obj;
                        csv.append(String.format("%s,%s,%s,%s,%s\n", i.getId(), i.getCustomerId(), i.getStatus(), i.getAmountDue(), i.getCreatedAt()));
                    }
                }
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + entity + ".csv")
                        .contentType(MediaType.parseMediaType("text/csv"))
                        .body(csv.toString().getBytes());
            } else {
                byte[] json = objectMapper.writeValueAsBytes(data);
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + entity + ".json")
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(json);
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(("Export failed: " + e.getMessage()).getBytes());
        }
    }
}

