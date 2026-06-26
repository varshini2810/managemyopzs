import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper to format currency
const fmt = (n, currency = 'USD') => {
  const num = parseFloat(n) || 0;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(num);
};

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Generates an individual invoice PDF
export async function generateInvoicePdf(invoice, customer = null, options = { preview: false }) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  
  // Set up fonts and colors
  const DARK = [20, 18, 15];
  const MUTED = [121, 117, 110];
  const BLUE = [0, 84, 255];
  
  let y = 40;

  // Header Background
  doc.setFillColor(20, 20, 20);
  doc.rect(0, 0, W, 110, 'F');
  
  // Left side: Company Logo/Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('OPZ BILLING', 40, 50);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Professional Invoicing Solutions', 40, 70);
  
  // Center: INVOICE title
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', W / 2, 55, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.id || 'INV-0001', W / 2, 75, { align: 'center' });
  
  // Right side: Status badge
  const status = (invoice.status || 'draft').toUpperCase();
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(W - 120, 45, 80, 24, 12, 12, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 20, 20);
  doc.text(status, W - 80, 61, { align: 'center' });
  
  y = 140;

  // Invoice & Customer Info
  const custName = customer?.companyName || customer?.name || invoice.customerName || invoice.client || '—';
  const custCompany = invoice.company || customer?.company || '—';
  const custEmail = invoice.email || customer?.email || '—';
  const custPhone = invoice.phone || customer?.phone || '—';
  
  // 3-Column Layout: From, Billed To, Invoice Details
  doc.setFontSize(12);
  doc.setTextColor(...DARK);
  doc.setFont('helvetica', 'bold');
  doc.text('From:', 40, y);
  doc.text('Billed To:', W/2 - 60, y);
  doc.text('Invoice Details:', W - 220, y);
  
  y += 18;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  // Column 1: From
  let fromY = y;
  doc.text('Opz Billing Inc.', 40, fromY); fromY += 14;
  doc.setTextColor(...MUTED);
  doc.text('contact@opz.io', 40, fromY); fromY += 14;
  doc.text('+1 800 123 4567', 40, fromY); fromY += 14;
  doc.text('www.opz.io', 40, fromY); fromY += 14;
  doc.text('GST: 12XXXXX3456X', 40, fromY); fromY += 14;
  
  // Column 2: Billed To
  let toY = y;
  doc.setTextColor(...DARK);
  doc.text(custName, W/2 - 60, toY); toY += 14;
  doc.setTextColor(...MUTED);
  if (custCompany !== '—') { doc.text(custCompany, W/2 - 60, toY); toY += 14; }
  if (custEmail !== '—') { doc.text(custEmail, W/2 - 60, toY); toY += 14; }
  if (custPhone !== '—') { doc.text(custPhone, W/2 - 60, toY); toY += 14; }
  
  // Column 3: Invoice Details
  let detY = y;
  const c3X1 = W - 220;
  const c3X2 = W - 40;
  doc.text('Invoice Date:', c3X1, detY); doc.text(fmtDate(invoice.issueDate || invoice.invoiceDate), c3X2, detY, { align: 'right' }); detY += 14;
  doc.text('Due Date:', c3X1, detY); doc.text(fmtDate(invoice.dueDate), c3X2, detY, { align: 'right' }); detY += 14;
  doc.text('Invoice Number:', c3X1, detY); doc.text(invoice.id || '—', c3X2, detY, { align: 'right' }); detY += 14;
  doc.text('Currency:', c3X1, detY); doc.text(invoice.currency || 'USD', c3X2, detY, { align: 'right' }); detY += 14;
  doc.text('Payment Terms:', c3X1, detY); doc.text(invoice.terms || '—', c3X2, detY, { align: 'right' }); detY += 14;
  
  y = Math.max(fromY, toY, detY) + 20;

  // Items Table
  const items = invoice.lineItems || invoice.items || [];
  const tableData = items.map(item => [
    item.product || item.name || '—',
    item.description || item.desc || '—',
    item.hsnCode || '—',
    item.quantity || item.qty || 1,
    fmt(item.unitAmount || item.price || 0, invoice.currency),
    `${item.tax || item.itemGstPercentage || 0}%`,
    `${item.discount || item.disc || 0}%`,
    fmt(item.amount || item.total || ((item.quantity||item.qty||1) * (item.unitAmount||item.price||0)), invoice.currency)
  ]);

  autoTable(doc, {
    startY: y,
    head: [['Product', 'Description', 'HSN Code', 'Qty', 'Unit Price', 'Tax', 'Discount', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: BLUE, textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 6 },
    columnStyles: {
      3: { halign: 'center' },
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right' },
      7: { halign: 'right', fontStyle: 'bold' }
    }
  });

  y = doc.lastAutoTable.finalY + 20;

  // Summary
  const subtotal = parseFloat(invoice.subtotal) || 0;
  const taxTotal = parseFloat(invoice.taxTotal || invoice.tax) || 0;
  const discTotal = parseFloat(invoice.discountTotal || invoice.disc) || 0;
  const total = parseFloat(invoice.total) || (subtotal + taxTotal - discTotal);
  
  doc.setFontSize(10);
  doc.setTextColor(...DARK);
  doc.text('Subtotal:', W - 180, y); doc.text(fmt(subtotal, invoice.currency), W - 40, y, { align: 'right' }); y += 16;
  if (discTotal > 0) {
    doc.text('Discount:', W - 180, y); doc.text(`-${fmt(discTotal, invoice.currency)}`, W - 40, y, { align: 'right' }); y += 16;
  }
  doc.text('Tax Total:', W - 180, y); doc.text(fmt(taxTotal, invoice.currency), W - 40, y, { align: 'right' }); y += 16;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Grand Total:', W - 180, y); doc.text(fmt(total, invoice.currency), W - 40, y, { align: 'right' }); y += 16;
  
  const amountDue = total - (parseFloat(invoice.paidAmt) || 0);
  
  // Highlight Amount Due in a dark box
  doc.setFillColor(20, 20, 20); // Dark box
  doc.rect(W - 190, y, 160, 28, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text('Amount Due:', W - 180, y + 18);
  doc.text(fmt(amountDue, invoice.currency), W - 40, y + 18, { align: 'right' });
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...MUTED);
    
    // Notes & Terms
    if (i === pageCount) {
      const fy = doc.internal.pageSize.getHeight() - 100;
      doc.text('Notes:', 40, fy);
      doc.text(invoice.notes || 'Thank you for your business.', 40, fy + 12);
      
      doc.text('Terms & Conditions:', 40, fy + 30);
      doc.text(invoice.terms || 'Payment is due within the specified terms.', 40, fy + 42);
      
      doc.setDrawColor(0);
      doc.line(W - 180, fy + 42, W - 40, fy + 42);
      doc.text('Authorized Signature', W - 140, fy + 54);
    }

    doc.text(`Page ${i} of ${pageCount}`, W - 40, doc.internal.pageSize.getHeight() - 20, { align: 'right' });
  }

  // Download / Preview
  const filename = `Invoice-${invoice.id || 'draft'}.pdf`;
  if (options.preview) {
    return doc.output('bloburl');
  }

  doc.save(filename);
  return filename;
}

// Bulk export of a list of invoices
export async function generateInvoiceListPdf(invoices) {
  const doc = new jsPDF({ unit: 'pt', orientation: 'landscape', format: 'a4' });
  const W = 841.89; // Landscape A4 width
  
  // Calculate Summaries
  const totalInvoices = invoices.length;
  const totalRevenue = invoices.reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + ((parseFloat(inv.total) || 0) - (parseFloat(inv.paidAmt) || 0)), 0);
  
  // Header
  doc.setFillColor(0, 84, 255);
  doc.rect(0, 0, W, 80, 'F');
  
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Export Report', 40, 40);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const dateStr = new Date().toISOString().split('T')[0];
  doc.text(`Export Date: ${fmtDate(new Date())}`, 40, 60);

  // Summary Cards
  doc.setTextColor(20, 18, 15);
  doc.setFontSize(10);
  doc.text('Total Invoices:', 40, 110);
  doc.setFont('helvetica', 'bold');
  doc.text(String(totalInvoices), 110, 110);
  
  doc.setFont('helvetica', 'normal');
  doc.text('Total Revenue:', 200, 110);
  doc.setFont('helvetica', 'bold');
  doc.text(fmt(totalRevenue, 'USD'), 270, 110); // Assuming USD or generic formatting
  
  doc.setFont('helvetica', 'normal');
  doc.text('Outstanding Amount:', 400, 110);
  doc.setFont('helvetica', 'bold');
  doc.text(fmt(totalOutstanding, 'USD'), 500, 110);

  // Table Data
  const tableData = invoices.map(r => [
    r.id, r.client, r.email, fmtDate(r.issueDate), fmtDate(r.dueDate), 
    r.currency, fmt(r.subtotal, r.currency), fmt(r.tax||0, r.currency), 
    fmt(r.disc||0, r.currency), fmt(r.total, r.currency), fmt(r.paidAmt||0, r.currency), r.status
  ]);

  autoTable(doc, {
    startY: 130,
    head: [['Invoice #', 'Client', 'Email', 'Issue Date', 'Due Date', 'Currency', 'Subtotal', 'Tax', 'Discount', 'Total', 'Paid', 'Status']],
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [0, 84, 255] }
  });

  const filename = `Invoices-${dateStr}.pdf`;
  doc.save(filename);
  return filename;
}
