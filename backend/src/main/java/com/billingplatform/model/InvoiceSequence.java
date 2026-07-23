package com.billingplatform.model;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;

@Entity
@Table(name = "invoice_number_sequences")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@IdClass(InvoiceSequence.InvoiceSequenceId.class)
public class InvoiceSequence {

    @Id
    @Column(name = "tenant_id", length = 100)
    private String tenantId;

    @Id
    @Column(name = "year")
    private Integer year;

    @Column(name = "last_sequence", nullable = false)
    @Builder.Default
    private Integer lastSequence = 0;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InvoiceSequenceId implements Serializable {
        private String tenantId;
        private Integer year;
    }
}
