package com.billingplatform.invoice;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfGeneratorService {

    public byte[] generateInvoicePdf(Invoice invoice) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.add(new Paragraph("INVOICE").setFontSize(24).setBold());
            document.add(new Paragraph("Invoice ID: " + invoice.getId()));
            document.add(new Paragraph("Status: " + invoice.getStatus()));
            document.add(new Paragraph("Customer ID: " + invoice.getCustomerId()));
            document.add(new Paragraph("Date: " + invoice.getCreatedAt()));
            document.add(new Paragraph("\n"));

            float[] columnWidths = {200F, 100F, 100F, 100F};
            Table table = new Table(columnWidths);

            table.addHeaderCell(new Cell().add(new Paragraph("Item Description").setBold()));
            table.addHeaderCell(new Cell().add(new Paragraph("Quantity").setBold()));
            table.addHeaderCell(new Cell().add(new Paragraph("Unit Price").setBold()));
            table.addHeaderCell(new Cell().add(new Paragraph("Amount").setBold()));

            if (invoice.getLineItems() != null) {
                for (InvoiceLineItem item : invoice.getLineItems()) {
                    table.addCell(new Cell().add(new Paragraph(item.getDescription() != null ? item.getDescription() : "Item")));
                    table.addCell(new Cell().add(new Paragraph(String.valueOf(item.getQuantity()))));
                    table.addCell(new Cell().add(new Paragraph("$" + item.getUnitAmount())));
                    table.addCell(new Cell().add(new Paragraph("$" + item.getAmount())));
                }
            }

            document.add(table);
            document.add(new Paragraph("\n"));
            document.add(new Paragraph("Subtotal: $" + invoice.getSubtotal()));
            document.add(new Paragraph("Total: $" + invoice.getTotal()).setBold());

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF: " + e.getMessage(), e);
        }
    }
}
