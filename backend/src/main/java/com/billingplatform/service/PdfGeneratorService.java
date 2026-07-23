package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;

import com.billingplatform.model.Invoice;

import com.billingplatform.model.Tenant;
import com.billingplatform.repository.TenantRepository;
import com.billingplatform.model.Customer;
import com.billingplatform.repository.CustomerRepository;
import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.VerticalAlignment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class PdfGeneratorService {

    private final CustomerRepository customerRepository;
    private final TenantRepository tenantRepository;

    public byte[] generateInvoicePdf(Invoice invoice) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf, PageSize.A4);
            document.setMargins(0, 0, 40, 0);

            Color DARK = new DeviceRgb(20, 20, 20);
            Color MUTED = new DeviceRgb(121, 117, 110);
            Color WHITE = new DeviceRgb(255, 255, 255);

            // Fetch Tenant & Customer
            Tenant tenant = null;
            if (invoice.getTenantId() != null) {
                tenant = tenantRepository.findById(invoice.getTenantId()).orElse(null);
            }
            Customer customer = null;
            if (invoice.getCustomerId() != null) {
                customer = customerRepository.findById(invoice.getCustomerId()).orElse(null);
            }

            // Draw Black Header Background using PdfCanvas
            PdfCanvas canvas = new PdfCanvas(pdf.addNewPage());
            canvas.setFillColor(DARK);
            canvas.rectangle(0, PageSize.A4.getHeight() - 120, PageSize.A4.getWidth(), 120);
            canvas.fill();

            // Header Elements (Using a table without borders)
            Table headerTable = new Table(new float[]{1, 1, 1}).useAllAvailableWidth();
            headerTable.setMarginTop(20);
            headerTable.setMarginLeft(40);
            headerTable.setMarginRight(40);
            
            // Left: Company Logo/Name
            String compName = tenant != null ? tenant.getName() : "OPZ BILLING";
            Cell leftCell = new Cell().setBorder(Border.NO_BORDER).setVerticalAlignment(VerticalAlignment.MIDDLE);
            leftCell.add(new Paragraph(compName.toUpperCase()).setFontColor(WHITE).setFontSize(22).setBold());
            leftCell.add(new Paragraph("Professional Invoicing Solutions").setFontColor(WHITE).setFontSize(10));
            headerTable.addCell(leftCell);

            // Center: INVOICE Title and Number
            Cell centerCell = new Cell().setBorder(Border.NO_BORDER).setVerticalAlignment(VerticalAlignment.MIDDLE).setTextAlignment(TextAlignment.CENTER);
            centerCell.add(new Paragraph("INVOICE").setFontColor(WHITE).setFontSize(28).setBold());
            centerCell.add(new Paragraph(invoice.getId() != null ? invoice.getId() : "INV-0000").setFontColor(WHITE).setFontSize(12));
            headerTable.addCell(centerCell);

            // Right: Status Badge
            Cell rightCell = new Cell().setBorder(Border.NO_BORDER).setVerticalAlignment(VerticalAlignment.MIDDLE).setTextAlignment(TextAlignment.RIGHT);
            String status = invoice.getStatus() != null ? invoice.getStatus().name() : "DRAFT";
            
            Table badgeTable = new Table(1);
            badgeTable.setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.RIGHT);
            Cell badge = new Cell().setBorder(new SolidBorder(WHITE, 1)).setBackgroundColor(WHITE)
                .add(new Paragraph(status).setFontColor(DARK).setFontSize(10).setBold().setTextAlignment(TextAlignment.CENTER))
                .setPadding(5).setPaddingLeft(15).setPaddingRight(15);
            badgeTable.addCell(badge);
            rightCell.add(badgeTable);
            headerTable.addCell(rightCell);

            document.add(headerTable);
            document.add(new Paragraph("\n").setHeight(40));

            // Three Column Layout: From, Billed To, Details
            Table infoTable = new Table(new float[]{1, 1, 1}).useAllAvailableWidth();
            infoTable.setMarginLeft(40).setMarginRight(40).setMarginBottom(30);

            // From Column
            Cell fromCell = new Cell().setBorder(Border.NO_BORDER);
            fromCell.add(new Paragraph("From:").setFontColor(DARK).setFontSize(12).setBold());
            fromCell.add(new Paragraph(compName).setFontColor(DARK).setFontSize(10));
            fromCell.add(new Paragraph(tenant != null && tenant.getDomain() != null ? tenant.getDomain() : "contact@opz.io").setFontColor(MUTED).setFontSize(10));
            fromCell.add(new Paragraph("+1 800 123 4567").setFontColor(MUTED).setFontSize(10));
            infoTable.addCell(fromCell);

            // Billed To Column
            Cell toCell = new Cell().setBorder(Border.NO_BORDER);
            toCell.add(new Paragraph("Billed To:").setFontColor(DARK).setFontSize(12).setBold());
            String cName = customer != null ? (customer.getFirstName() + " " + customer.getLastName()).trim() : "Client Name";
            String cComp = customer != null && customer.getCompanyName() != null ? customer.getCompanyName() : "";
            toCell.add(new Paragraph(cName).setFontColor(DARK).setFontSize(10));
            if (!cComp.isEmpty()) toCell.add(new Paragraph(cComp).setFontColor(MUTED).setFontSize(10));
            if (customer != null && customer.getEmail() != null) toCell.add(new Paragraph(customer.getEmail()).setFontColor(MUTED).setFontSize(10));
            if (customer != null && customer.getPhone() != null) toCell.add(new Paragraph(customer.getPhone()).setFontColor(MUTED).setFontSize(10));
            infoTable.addCell(toCell);

            // Details Column
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("MMM dd, yyyy");
            Cell detCell = new Cell().setBorder(Border.NO_BORDER);
            detCell.add(new Paragraph("Invoice Details:").setFontColor(DARK).setFontSize(12).setBold());
            
            Table detProps = new Table(new float[]{1, 1}).useAllAvailableWidth();
            addPropRow(detProps, "Invoice Date:", invoice.getCreatedAt() != null ? invoice.getCreatedAt().format(dtf) : "—", MUTED, DARK);
            addPropRow(detProps, "Due Date:", invoice.getDueDate() != null ? invoice.getDueDate().format(dtf) : "—", MUTED, DARK);
            addPropRow(detProps, "Currency:", invoice.getCurrency() != null ? invoice.getCurrency() : "USD", MUTED, DARK);
            detCell.add(detProps);
            infoTable.addCell(detCell);

            document.add(infoTable);

            // Line Items Table
            Table itemsTable = new Table(new float[]{3, 1, 1, 1, 1, 1}).useAllAvailableWidth();
            itemsTable.setMarginLeft(40).setMarginRight(40);
            
            Color BLUE = new DeviceRgb(0, 84, 255);
            addCell(itemsTable, "Product & Description", BLUE, WHITE, true, TextAlignment.LEFT);
            addCell(itemsTable, "HSN Code", BLUE, WHITE, true, TextAlignment.LEFT);
            addCell(itemsTable, "Qty", BLUE, WHITE, true, TextAlignment.RIGHT);
            addCell(itemsTable, "Price", BLUE, WHITE, true, TextAlignment.RIGHT);
            addCell(itemsTable, "Tax", BLUE, WHITE, true, TextAlignment.RIGHT);
            addCell(itemsTable, "Amount", BLUE, WHITE, true, TextAlignment.RIGHT);

            if (invoice.getLineItems() != null) {
                for (InvoiceLineItem item : invoice.getLineItems()) {
                    addCell(itemsTable, item.getDescription() != null ? item.getDescription() : "—", null, DARK, false, TextAlignment.LEFT);
                    addCell(itemsTable, "—", null, DARK, false, TextAlignment.LEFT);
                    addCell(itemsTable, String.valueOf(item.getQuantity()), null, DARK, false, TextAlignment.RIGHT);
                    addCell(itemsTable, fmt(item.getUnitAmount()), null, DARK, false, TextAlignment.RIGHT);
                    addCell(itemsTable, fmt(item.getTaxAmount()), null, DARK, false, TextAlignment.RIGHT);
                    addCell(itemsTable, fmt(item.getAmount()), null, DARK, false, TextAlignment.RIGHT);
                }
            }
            document.add(itemsTable);
            document.add(new Paragraph("\n"));

            // Totals Section
            Table totalsTable = new Table(new float[]{1, 1}).setWidth(250).setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.RIGHT);
            totalsTable.setMarginRight(40);
            
            addPropRow(totalsTable, "Subtotal:", fmt(invoice.getSubtotal()), DARK, DARK);
            addPropRow(totalsTable, "Tax Total:", fmt(invoice.getTaxTotal()), DARK, DARK);
            addPropRow(totalsTable, "Discount:", fmt(java.math.BigDecimal.ZERO), DARK, DARK);
            
            Cell tLabel = new Cell().setBorder(Border.NO_BORDER).add(new Paragraph("Grand Total:").setFontColor(DARK).setFontSize(12).setBold());
            Cell tVal = new Cell().setBorder(Border.NO_BORDER).add(new Paragraph(fmt(invoice.getTotal())).setFontColor(DARK).setFontSize(12).setBold().setTextAlignment(TextAlignment.RIGHT));
            totalsTable.addCell(tLabel);
            totalsTable.addCell(tVal);
            
            document.add(totalsTable);
            document.add(new Paragraph("\n"));

            // Amount Due Box
            BigDecimal paid = invoice.getPaymentStatus() == Invoice.PaymentStatus.PAID ? invoice.getTotal() : BigDecimal.ZERO;
            BigDecimal amountDue = invoice.getTotal() != null ? invoice.getTotal().subtract(paid) : BigDecimal.ZERO;
            
            Table dueTable = new Table(new float[]{1, 1}).setWidth(250).setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.RIGHT);
            dueTable.setMarginRight(40);
            
            Cell dueCell = new Cell(1, 2).setBackgroundColor(DARK).setPadding(10).setBorder(Border.NO_BORDER);
            Table innerDue = new Table(new float[]{1, 1}).useAllAvailableWidth();
            innerDue.addCell(new Cell().setBorder(Border.NO_BORDER).add(new Paragraph("Amount Due:").setFontColor(WHITE).setFontSize(12).setBold()));
            innerDue.addCell(new Cell().setBorder(Border.NO_BORDER).add(new Paragraph(fmt(amountDue)).setFontColor(WHITE).setFontSize(12).setBold().setTextAlignment(TextAlignment.RIGHT)));
            dueCell.add(innerDue);
            dueTable.addCell(dueCell);
            
            document.add(dueTable);

            // Footer
            document.add(new Paragraph("\n\n"));
            Paragraph footer = new Paragraph("Thank you for your business.\nPayment is due within the specified terms.")
                    .setFontSize(9).setFontColor(MUTED).setTextAlignment(TextAlignment.CENTER);
            document.add(footer);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF: " + e.getMessage(), e);
        }
    }

    private void addPropRow(Table table, String label, String value, Color labelColor, Color valueColor) {
        table.addCell(new Cell().setBorder(Border.NO_BORDER).add(new Paragraph(label).setFontColor(labelColor).setFontSize(10)));
        table.addCell(new Cell().setBorder(Border.NO_BORDER).add(new Paragraph(value).setFontColor(valueColor).setFontSize(10).setTextAlignment(TextAlignment.RIGHT)));
    }

    private void addCell(Table table, String text, Color bgColor, Color textColor, boolean isHeader, TextAlignment align) {
        Cell cell = new Cell().add(new Paragraph(text).setFontColor(textColor).setFontSize(isHeader ? 10 : 9));
        if (bgColor != null) cell.setBackgroundColor(bgColor);
        if (isHeader) cell.setBold();
        cell.setTextAlignment(align);
        cell.setBorder(new SolidBorder(new DeviceRgb(229, 229, 224), 1));
        cell.setPadding(6);
        table.addCell(cell);
    }
    
    private String fmt(BigDecimal val) {
        if (val == null) return "$0.00";
        return "$" + val.setScale(2, java.math.RoundingMode.HALF_UP).toString();
    }
}
