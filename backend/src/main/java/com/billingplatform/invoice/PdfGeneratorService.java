package com.billingplatform.invoice;

import com.billingplatform.auth.Tenant;
import com.billingplatform.auth.TenantRepository;
import com.billingplatform.customer.Customer;
import com.billingplatform.customer.CustomerRepository;
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
import com.itextpdf.layout.properties.VerticalAlignment;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class PdfGeneratorService {

    private final CustomerRepository customerRepository;
    private final TenantRepository tenantRepository;
    private final JdbcTemplate jdbcTemplate;

    public byte[] generateInvoicePdf(Invoice invoice) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf, PageSize.A4);
            document.setMargins(40, 40, 40, 40);

            // Brand Colors
            Color BRAND = new DeviceRgb(88, 110, 240); // #586EF0
            Color DARK = new DeviceRgb(30, 30, 30);
            Color MUTED = new DeviceRgb(120, 120, 120);
            Color WHITE = new DeviceRgb(255, 255, 255);
            Color BG_MAIN = new DeviceRgb(244, 247, 250); // #F4F7FA
            Color BORDER_COLOR = new DeviceRgb(230, 230, 230);

            // Draw Background Soft Blue
            PdfCanvas canvas = new PdfCanvas(pdf.addNewPage());
            canvas.setFillColor(BG_MAIN);
            canvas.rectangle(0, 0, PageSize.A4.getWidth(), PageSize.A4.getHeight());
            canvas.fill();

            // Draw White Card
            float cardMargin = 20;
            canvas.setFillColor(WHITE);
            // Simulate rounded corners by just drawing a rectangle slightly inset
            canvas.rectangle(cardMargin, cardMargin, PageSize.A4.getWidth() - 2 * cardMargin, PageSize.A4.getHeight() - 2 * cardMargin);
            canvas.fill();

            // Fetch Data
            Tenant tenant = null;
            if (invoice.getTenantId() != null) {
                tenant = tenantRepository.findById(invoice.getTenantId()).orElse(null);
            }
            Customer customer = null;
            if (invoice.getCustomerId() != null) {
                customer = customerRepository.findById(invoice.getCustomerId()).orElse(null);
            }

            Map<String, Object> bp = null;
            try {
                bp = jdbcTemplate.queryForMap("SELECT * FROM business_profile WHERE id = 1");
            } catch (Exception e) {}

            String compName = bp != null && bp.get("company_name") != null ? bp.get("company_name").toString() : (tenant != null ? tenant.getName() : "Your Company");
            String compEmail = tenant != null && tenant.getDomain() != null ? "contact@" + tenant.getDomain() : "hello@company.com";
            String compPhone = "+1 800 123 4567";
            String gst = bp != null && bp.get("tax_registration_number") != null ? bp.get("tax_registration_number").toString() : "";
            
            String addr1 = bp != null && bp.get("address_line1") != null ? bp.get("address_line1").toString() : "";
            String addr2 = bp != null && bp.get("address_line2") != null ? bp.get("address_line2").toString() : "";
            String city = bp != null && bp.get("city") != null ? bp.get("city").toString() : "";
            String state = bp != null && bp.get("state") != null ? bp.get("state").toString() : "";
            String zip = bp != null && bp.get("zip_code") != null ? bp.get("zip_code").toString() : "";
            String country = bp != null && bp.get("country") != null ? bp.get("country").toString() : "";
            String fullAddress = Stream.of(addr1, addr2, city, state, zip, country)
                    .filter(s -> s != null && !s.isEmpty())
                    .collect(Collectors.joining(", "));

            // 1. TOP SECTION (Two Columns)
            Table headerTable = new Table(new float[]{1, 1}).useAllAvailableWidth();
            headerTable.setMarginBottom(30);

            // Left: Company Info
            Cell leftCell = new Cell().setBorder(Border.NO_BORDER);
            leftCell.add(new Paragraph(compName).setFontColor(BRAND).setFontSize(18).setBold());
            leftCell.add(new Paragraph(compEmail).setFontColor(MUTED).setFontSize(10));
            leftCell.add(new Paragraph(compPhone).setFontColor(MUTED).setFontSize(10));
            if (!fullAddress.isEmpty()) {
                leftCell.add(new Paragraph(fullAddress).setFontColor(MUTED).setFontSize(10));
            }
            if (!gst.isEmpty()) {
                leftCell.add(new Paragraph("GSTIN: " + gst).setFontColor(DARK).setFontSize(10).setBold());
            }
            headerTable.addCell(leftCell);

            // Right: Invoice Label & Status
            Cell rightCell = new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT);
            rightCell.add(new Paragraph("INVOICE").setFontColor(DARK).setFontSize(24).setBold());
            rightCell.add(new Paragraph("#" + invoice.getId()).setFontColor(MUTED).setFontSize(12));
            
            String status = invoice.getStatus() != null ? invoice.getStatus().name() : "DRAFT";
            Color statusBg = status.equals("PAID") ? new DeviceRgb(220, 252, 231) : new DeviceRgb(254, 243, 199);
            Color statusText = status.equals("PAID") ? new DeviceRgb(22, 163, 74) : new DeviceRgb(217, 119, 6);
            
            Table badgeTable = new Table(1).setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.RIGHT).setMarginTop(5);
            badgeTable.addCell(new Cell().setBorder(Border.NO_BORDER).setBackgroundColor(statusBg)
                .add(new Paragraph(status).setFontColor(statusText).setFontSize(9).setBold())
                .setPaddingLeft(10).setPaddingRight(10).setPaddingTop(3).setPaddingBottom(3));
            rightCell.add(badgeTable);
            
            headerTable.addCell(rightCell);
            document.add(headerTable);

            // 2 & 3. BILL TO and DATES (Two Columns)
            Table midTable = new Table(new float[]{1, 1}).useAllAvailableWidth();
            midTable.setMarginBottom(20);

            // Bill To
            Cell billToCell = new Cell().setBorder(Border.NO_BORDER);
            billToCell.add(new Paragraph("BILL TO:").setFontColor(MUTED).setFontSize(9));
            
            String cName = customer != null ? (customer.getFirstName() + " " + customer.getLastName()).trim() : "Client Name";
            String cComp = customer != null && customer.getCompanyName() != null ? customer.getCompanyName() : "";
            billToCell.add(new Paragraph(cComp.isEmpty() ? cName : cComp).setFontColor(DARK).setFontSize(11).setBold());
            if (!cComp.isEmpty()) {
                billToCell.add(new Paragraph(cName).setFontColor(DARK).setFontSize(10));
            }
            if (customer != null && customer.getEmail() != null) {
                billToCell.add(new Paragraph(customer.getEmail()).setFontColor(MUTED).setFontSize(10));
            }
            
            String cVat = customer != null && customer.getVatNumber() != null ? customer.getVatNumber() : "";
            String cAddr1 = customer != null && customer.getBillingLine1() != null ? customer.getBillingLine1() : "";
            String cCity = customer != null && customer.getBillingCity() != null ? customer.getBillingCity() : "";
            String cState = customer != null && customer.getBillingState() != null ? customer.getBillingState() : "";
            String cZip = customer != null && customer.getBillingZip() != null ? customer.getBillingZip() : "";
            String cCountry = customer != null && customer.getBillingCountry() != null ? customer.getBillingCountry() : "";
            String cFullAddr = Stream.of(cAddr1, cCity, cState, cZip, cCountry)
                    .filter(s -> s != null && !s.isEmpty())
                    .collect(Collectors.joining(", "));
            
            String clientDetails = "";
            if (!cVat.isEmpty()) clientDetails += "GST: " + cVat;
            if (!cFullAddr.isEmpty()) {
                if (!clientDetails.isEmpty()) clientDetails += "\n";
                clientDetails += cFullAddr;
            }
            if (!clientDetails.isEmpty()) {
                billToCell.add(new Paragraph(clientDetails).setFontColor(MUTED).setFontSize(10));
            }
            midTable.addCell(billToCell);

            // Dates
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            Cell datesCell = new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT).setVerticalAlignment(VerticalAlignment.BOTTOM);
            String issueDate = invoice.getCreatedAt() != null ? invoice.getCreatedAt().format(dtf) : "";
            String dueDate = invoice.getDueDate() != null ? invoice.getDueDate().format(dtf) : "";
            
            datesCell.add(new Paragraph("Issue Date: " + issueDate).setFontColor(DARK).setFontSize(10));
            datesCell.add(new Paragraph("Due Date: " + dueDate).setFontColor(DARK).setFontSize(10));
            midTable.addCell(datesCell);
            
            document.add(midTable);

            // 4. LINE ITEMS TABLE
            Table itemsTable = new Table(new float[]{3, 1, 1, 1, 1}).useAllAvailableWidth();
            itemsTable.setMarginBottom(20);
            
            String currCode = invoice.getCurrency() != null ? invoice.getCurrency() : "USD";
            
            addHeader(itemsTable, "Description", TextAlignment.LEFT);
            addHeader(itemsTable, "HSN", TextAlignment.LEFT);
            addHeader(itemsTable, "Quantity", TextAlignment.RIGHT);
            addHeader(itemsTable, "Rate", TextAlignment.RIGHT);
            addHeader(itemsTable, "Amount", TextAlignment.RIGHT);

            if (invoice.getLineItems() != null) {
                for (InvoiceLineItem item : invoice.getLineItems()) {
                    String hsn = item.getHsnSacCode() != null ? item.getHsnSacCode() : "";
                    
                    Cell desc = new Cell().add(new Paragraph(item.getDescription() != null ? item.getDescription() : "").setFontColor(BRAND).setFontSize(10));
                    desc.setBorder(Border.NO_BORDER).setBorderBottom(new SolidBorder(BORDER_COLOR, 1)).setPadding(8);
                    itemsTable.addCell(desc);
                    
                    addRow(itemsTable, hsn, TextAlignment.LEFT, BORDER_COLOR, DARK);
                    addRow(itemsTable, String.valueOf(item.getQuantity()), TextAlignment.RIGHT, BORDER_COLOR, DARK);
                    addRow(itemsTable, fmt(item.getUnitAmount(), currCode), TextAlignment.RIGHT, BORDER_COLOR, DARK);
                    addRow(itemsTable, fmt(item.getAmount(), currCode), TextAlignment.RIGHT, BORDER_COLOR, DARK);
                }
            }
            document.add(itemsTable);

            // 5. TOTALS SECTION
            Table totalsTable = new Table(new float[]{1, 1}).setWidth(250).setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.RIGHT);
            
            addPropRow(totalsTable, "Sub Total:", fmt(invoice.getSubtotal(), currCode), DARK, DARK);
            addPropRow(totalsTable, "Total Tax:", fmt(invoice.getTaxTotal(), currCode), DARK, DARK);
            if (invoice.getDiscountTotal() != null && invoice.getDiscountTotal().compareTo(BigDecimal.ZERO) > 0) {
                addPropRow(totalsTable, "Discount:", "-" + fmt(invoice.getDiscountTotal(), currCode), DARK, DARK);
            }
            
            Cell tLabel = new Cell().setBorder(Border.NO_BORDER).add(new Paragraph("Grand Total:").setFontColor(DARK).setFontSize(12).setBold());
            Cell tVal = new Cell().setBorder(Border.NO_BORDER).add(new Paragraph(fmt(invoice.getTotal(), currCode)).setFontColor(BRAND).setFontSize(14).setBold().setTextAlignment(TextAlignment.RIGHT));
            tLabel.setPaddingTop(10);
            tVal.setPaddingTop(10);
            totalsTable.addCell(tLabel);
            totalsTable.addCell(tVal);
            
            document.add(totalsTable);
            
            // 6. SIGNATURE BLOCK
            Table sigTable = new Table(1).setWidth(200).setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.RIGHT);
            sigTable.setMarginTop(50);
            
            Cell sigLine = new Cell().setBorder(Border.NO_BORDER).setBorderBottom(new SolidBorder(DARK, 1)).setHeight(30);
            sigTable.addCell(sigLine);
            
            Cell sigName = new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.CENTER).setPaddingTop(5);
            sigName.add(new Paragraph(compName).setFontColor(DARK).setFontSize(10).setBold());
            sigName.add(new Paragraph("AUTHORISED SIGNATORY").setFontColor(MUTED).setFontSize(8));
            sigTable.addCell(sigName);
            
            document.add(sigTable);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF: " + e.getMessage(), e);
        }
    }
    
    private void addHeader(Table table, String text, TextAlignment align) {
        Cell cell = new Cell().add(new Paragraph(text).setFontColor(new DeviceRgb(120, 120, 120)).setFontSize(9));
        cell.setBorder(Border.NO_BORDER).setBorderBottom(new SolidBorder(new DeviceRgb(200, 200, 200), 1));
        cell.setTextAlignment(align).setPadding(8);
        table.addCell(cell);
    }
    
    private void addRow(Table table, String text, TextAlignment align, Color borderCol, Color textCol) {
        Cell cell = new Cell().add(new Paragraph(text).setFontColor(textCol).setFontSize(10));
        cell.setBorder(Border.NO_BORDER).setBorderBottom(new SolidBorder(borderCol, 1));
        cell.setTextAlignment(align).setPadding(8);
        table.addCell(cell);
    }

    private void addPropRow(Table table, String label, String value, Color labelColor, Color valueColor) {
        table.addCell(new Cell().setBorder(Border.NO_BORDER).setPadding(4).add(new Paragraph(label).setFontColor(labelColor).setFontSize(10)));
        table.addCell(new Cell().setBorder(Border.NO_BORDER).setPadding(4).add(new Paragraph(value).setFontColor(valueColor).setFontSize(10).setTextAlignment(TextAlignment.RIGHT)));
    }
    
    private String fmt(BigDecimal val, String currencyCode) {
        if (val == null) return "0.00";
        String symbol = "";
        try {
            java.util.Currency currency = java.util.Currency.getInstance(currencyCode);
            symbol = currency.getSymbol();
        } catch (Exception e) {
            symbol = currencyCode + " ";
        }
        return symbol + val.setScale(2, java.math.RoundingMode.HALF_UP).toString();
    }
}
