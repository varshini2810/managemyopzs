package com.billingplatform.expense;

import com.billingplatform.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Where;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "expenses")
@Where(clause = "deleted_at IS NULL")
public class Expense extends BaseEntity {

    @Id
    @Column(length = 50)
    private String id;

    @Column(length = 100)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 255)
    private String vendor;

    @Column(length = 255)
    private String employee;

    @Column(length = 100)
    private String department;

    @Column(precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(precision = 15, scale = 2)
    private BigDecimal tax;

    @Column(length = 10)
    private String currency;

    @Column(name = "payment_method", length = 100)
    private String paymentMethod;

    private LocalDate date;

    @Column(length = 50)
    private String status;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean receipt = false;

    @Column(columnDefinition = "TEXT")
    @jakarta.persistence.Convert(converter = StringListConverter.class)
    private java.util.List<String> tags;

    @Column(name = "invoice_num", length = 100)
    private String invoiceNum;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getVendor() { return vendor; }
    public void setVendor(String vendor) { this.vendor = vendor; }

    public String getEmployee() { return employee; }
    public void setEmployee(String employee) { this.employee = employee; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BigDecimal getTax() { return tax; }
    public void setTax(BigDecimal tax) { this.tax = tax; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Boolean getReceipt() { return receipt; }
    public void setReceipt(Boolean receipt) { this.receipt = receipt; }

    public java.util.List<String> getTags() { return tags; }
    public void setTags(java.util.List<String> tags) { this.tags = tags; }

    public String getInvoiceNum() { return invoiceNum; }
    public void setInvoiceNum(String invoiceNum) { this.invoiceNum = invoiceNum; }

    @jakarta.persistence.PrePersist
    public void prePersistExpense() {
        super.prePersist();
        if (this.id == null) {
            this.id = "exp-" + java.util.UUID.randomUUID().toString();
        }
    }
}
