package com.billingplatform.invoice;

import com.billingplatform.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Where;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoice_notifications")
@Where(clause = "deleted_at IS NULL")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InvoiceNotification extends BaseEntity {

    @Id
    @Column(length = 100)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false, columnDefinition = "VARCHAR(20)")
    private Channel channel;

    @Enumerated(EnumType.STRING)
    @Column(name = "notification_type", length = 50, nullable = false, columnDefinition = "VARCHAR(50)")
    private NotificationType type;

    @Column(name = "scheduled_for", nullable = false)
    private LocalDateTime scheduledFor;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false, columnDefinition = "VARCHAR(20)")
    private Status status;

    public enum Channel {
        EMAIL, SMS, WHATSAPP
    }

    public enum NotificationType {
        CREATED, REMINDER_1, REMINDER_2, OVERDUE, OVERDUE_REMINDER_1, OVERDUE_REMINDER_2, PAID
    }

    public enum Status {
        PENDING, SENT, FAILED, CANCELLED
    }

    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = "notif-" + java.util.UUID.randomUUID().toString();
        }
        if (status == null) {
            status = Status.PENDING;
        }
    }
}
