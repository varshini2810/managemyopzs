package com.billingplatform.invoice;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("local")
public class PdfTest {

    @Autowired
    private PdfGeneratorService pdfGeneratorService;

    @Autowired
    private InvoiceService invoiceService;

    @Test
    public void testPdf() {
        Invoice invoice = invoiceService.getInvoice("INV-AAA-2026-000001");
        System.out.println("Generating PDF for " + invoice.getId());
        try {
            pdfGeneratorService.generateInvoicePdf(invoice);
            System.out.println("SUCCESS PDF!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
