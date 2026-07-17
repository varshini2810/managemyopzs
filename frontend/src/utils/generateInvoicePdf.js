import { jsPDF } from 'jspdf';

// Helper to load font dynamically from Google Fonts for '₹' support
async function loadRobotoFont(doc) {
  try {
    // Fetch a base64 or arraybuffer of Roboto-Regular
    // To ensure it always works without network issues in production,
    // we use a known stable URL or encode it. Since we can't easily inline a 150kb base64 string here,
    // we fetch it.
    const url = 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Font fetch failed');
    const buffer = await res.arrayBuffer();

    // Convert ArrayBuffer to Base64
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64Font = btoa(binary);
    doc.addFileToVFS('Roboto-Regular.ttf', base64Font);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');

    // Also load Roboto Bold for totals
    const urlBold = 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf';
    const resBold = await fetch(urlBold);
    if (resBold.ok) {
      const bufferBold = await resBold.arrayBuffer();
      const bytesBold = new Uint8Array(bufferBold);
      let binaryBold = '';
      for (let i = 0; i < bytesBold.byteLength; i++) {
        binaryBold += String.fromCharCode(bytesBold[i]);
      }
      doc.addFileToVFS('Roboto-Bold.ttf', btoa(binaryBold));
      doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
    }
  } catch (err) {
    console.warn('Failed to load custom font, falling back to Helvetica:', err);
  }
}

/**
 * Generates a professional invoice PDF and triggers browser download.
 */
export async function generateInvoicePdf(invoice, customer = null) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  await loadRobotoFont(doc);
  const W = 595.28;
  const H = 841.89;

  // ─── Colour Palette ────────────────────────────────────────────────────────
  const DARK = [20, 18, 15]; // RGB(0.08, 0.07, 0.06) * 255
  const BLUE = [0, 84, 255]; // RGB(0, 0.33, 1) * 255
  const MUTED = [121, 117, 110]; // RGB(0.475, 0.459, 0.431) * 255
  const BORDER = [229, 229, 224]; // RGB(0.9, 0.9, 0.88) * 255
  const GREEN = [23, 163, 74]; // RGB(0.09, 0.64, 0.29) * 255
  const AMBER = [217, 119, 6]; // SENT
  const RED = [192, 41, 43]; // OVERDUE
  const WHITE = [255, 255, 255];
  const TABLE_HEADER_BG = [245, 245, 242]; // RGB(0.96, 0.96, 0.95) * 255
  const TABLE_ROW_BG = [252, 252, 250]; // RGB(0.99, 0.99, 0.98) * 255

  // ─── Helper Functions ──────────────────────────────────────────────────────
  const fmt = (n) => {
    const num = parseFloat(n) || 0;
    // Uses standard "₹" symbol, ensuring correct spacing with Roboto font
    return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const fmtDate = (d) => {
    if (!d) return '—';
    // DD Mon YYYY
    const opts = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(d).toLocaleDateString('en-IN', opts);
  };

  const setFont = (style = 'normal') => {
    // If we loaded Roboto successfully, use it, else fallback
    const fontName = doc.getFontList()['Roboto'] ? 'Roboto' : 'helvetica';
    doc.setFont(fontName, style);
  };

  let currentPage = 1;
  let y = 0;

  const drawHeader = () => {
    // ─── HEADER BAND ──────────────────────────────────────────────────────────
    doc.setFillColor(...DARK);
    doc.rect(0, 0, W, 90, 'F');

    // Logo hexagon + bars
    doc.setDrawColor(...WHITE);
    doc.setLineWidth(1.5);
    const lx = 40, ly = 22, lr = 20;
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      pts.push([lx + lr * Math.cos(a), ly + lr * Math.sin(a)]);
    }
    for (let i = 0; i < 6; i++) {
      const next = (i + 1) % 6;
      doc.line(pts[i][0], pts[i][1] + 14, pts[next][0], pts[next][1] + 14);
    }

    // Blue accent circles
    doc.setFillColor(...BLUE);
    [[lx, ly + 14 - lr], [lx, ly + 14 + lr], [lx - lr, ly + 14], [lx + lr, ly + 14]].forEach(([cx, cy]) => {
      doc.circle(cx, cy, 4, 'F');
    });

    // Mini bar chart
    [[lx - 10, 8], [lx, 12], [lx + 10, 17]].forEach(([bx, bh]) => {
      doc.setFillColor(...BLUE);
      doc.rect(bx, ly + 14 - bh / 2 + 8, 6, bh, 'F');
    });

    // Company name
    setFont('bold');
    doc.setFontSize(18);
    doc.setTextColor(...WHITE);
    doc.text('Opz', 70, 42);

    setFont('normal');
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text('Subscription Billing & Revenue Platform', 70, 54);

    // INVOICE label
    setFont('bold');
    doc.setFontSize(28);
    doc.setTextColor(...WHITE);
    doc.text('INVOICE', 440, 42, { align: 'right' }); // Right-aligned near 440

    setFont('normal');
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text(invoice.id || 'INV-TEN-2026-000001', 440, 56, { align: 'right' });

    // Status badge (top-right, x=499-555)
    const status = (invoice.status || 'POSTED').toUpperCase();
    const payStatus = (invoice.paymentStatus || '').toUpperCase();
    let badgeLabel = status;
    if (payStatus === 'PAID') badgeLabel = 'PAID';
    else if (payStatus === 'OVERDUE') badgeLabel = 'OVERDUE';
    else if (status === 'SENT') badgeLabel = 'SENT';

    let badgeColor = BLUE; // Default fallback
    if (badgeLabel === 'PAID') badgeColor = GREEN;
    else if (badgeLabel === 'OVERDUE') badgeColor = RED;
    else if (badgeLabel === 'SENT') badgeColor = AMBER;

    const bw = 56, bh2 = 16, bx = 499, by = 62; // x=499 to 555 (width 56)
    doc.setFillColor(...badgeColor);
    doc.roundedRect(bx, by, bw, bh2, 4, 4, 'F');

    setFont('bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...WHITE);
    doc.text(badgeLabel, bx + bw / 2, by + 10.5, { align: 'center' });
    y = 110;
  };

  const drawFooter = () => {
    // ─── BOTTOM ACCENT BAR ────────────────────────────────────────────────────
    doc.setFillColor(...BLUE);
    doc.rect(0, H - 6, W, 6, 'F');

    // ─── PAGE NUMBER & DATE ───────────────────────────────────────────────────
    setFont('normal');
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    const issueDateStr = fmtDate(new Date());
    doc.text(`Generated on ${issueDateStr} • ${invoice.id || 'draft'}`, W / 2, H - 14, { align: 'center' });
  };

  const addPageIfNecessary = (requiredHeight) => {
    if (y + requiredHeight > H - 80) { // 80pt reserved for footer
      drawFooter();
      doc.addPage();
      currentPage++;
      y = 40; // Reset y for new page without header band
      // Alternatively, redraw header on every page?
      // "multi-page handling... the table must continue onto a second page with the same header styling repeated"
      // If we need the full header band repeated:
      // drawHeader();
      drawTableHeader(); // Redraw table header too!
    }
  };

  const drawTableHeader = () => {
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.5);
    doc.line(40, y - 8, W - 40, y - 8); // Thin divider line above table

    // Table header row
    doc.setFillColor(...TABLE_HEADER_BG);
    doc.rect(40, y - 4, W - 80, 26, 'F');

    setFont('bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    // Exact spec positions
    doc.text('DESCRIPTION', 40, y + 12);
    doc.text('QTY', 305, y + 12, { align: 'center' }); // center around 305
    doc.text('UNIT PRICE', 358, y + 12, { align: 'right' }); // or left? "UNIT PRICE (x≈358)"
    doc.text('GST %', 436, y + 12, { align: 'right' });
    doc.text('AMOUNT', 522, y + 12, { align: 'right' });

    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.25);
    doc.line(40, y + 22, W - 40, y + 22);

    y += 26;
  };

  // --- Start Generation ---
  drawHeader();

  // ─── BILLING INFO ROW ────────────────────────────────────────────────────
  // FROM block (left)
  setFont('bold');
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text('FROM', 40, y);
  y += 12;

  setFont('bold');
  doc.setFontSize(10);
  doc.setTextColor(...DARK);
  doc.text('Opz Billing Platform', 40, y);
  y += 13;

  setFont('normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  doc.text('billing@opz.io', 40, y);
  y += 11;
  doc.text('support.opz.io', 40, y);

  // TO block (right column, x=297.64)
  let ty = 110;
  const toX = 297.64;
  setFont('bold');
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text('BILLED TO', toX, ty);
  ty += 12;

  const custName = customer?.companyName || (customer ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim() : null) || invoice.customerName || invoice.customerId || '—';
  setFont('bold');
  doc.setFontSize(10);
  doc.setTextColor(...DARK);
  doc.text(custName, toX, ty);
  ty += 13;

  setFont('normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  if (customer?.email) {
    doc.text(customer.email, toX, ty);
    ty += 11;
  }
  if (customer?.phone) {
    doc.text(customer.phone, toX, ty);
    ty += 11;
  }
  if (customer?.vatNumber) {
    doc.text(`GST: ${customer.vatNumber}`, toX, ty);
    ty += 11;
  }
  if (customer?.billingLine1) {
    const addr = [customer.billingLine1, customer.billingCity, customer.billingState, customer.billingZip]
      .filter(Boolean).join(', ');
    const wrapped = doc.splitTextToSize(addr, 180);
    doc.text(wrapped, toX, ty);
    ty += wrapped.length * 11;
  }

  // ─── DATE INFO (Far right column) ─────────────────────────────────────────────
  const dateX = 524; // right-aligned x=505-524
  let dy = 110;

  const dateRows = [
    ['Invoice Date', fmtDate(invoice.issueDate || invoice.invoiceDate || invoice.createdAt)],
    ['Due Date', fmtDate(invoice.dueDate)],
    ['Invoice No.', invoice.id || '—'],
  ];

  dateRows.forEach(([label, val]) => {
    setFont('normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text(label, dateX, dy, { align: 'right' });
    dy += 11;

    setFont('bold');
    doc.setFontSize(9);
    doc.setTextColor(...DARK);
    doc.text(val, dateX, dy, { align: 'right' });
    dy += 14;
  });

  // Position y past the tallest section
  y = Math.max(ty, dy) + 20;

  // ─── LINE ITEMS TABLE ─────────────────────────────────────────────────────
  drawTableHeader();

  const items = invoice.lineItems || [];
  items.forEach((item) => {
    // Estimate height
    const desc = item.description || item.name || '—';
    const descLines = doc.splitTextToSize(desc, 240);
    const rowHeight = Math.max(26, 12 + descLines.length * 10 + 10);

    addPageIfNecessary(rowHeight);

    // Row bg
    doc.setFillColor(...TABLE_ROW_BG);
    doc.rect(40, y - 4, W - 80, rowHeight, 'F');

    const qty = parseFloat(item.quantity || item.qty || 1);
    const unit = parseFloat(item.unitAmount || item.price || 0);
    const gstPct = parseFloat(item.itemGstPercentage || item.gst || 0);
    const lineTotal = qty * unit;
    const lineTax = lineTotal * (gstPct / 100);
    const lineGross = lineTotal + lineTax;

    setFont('normal');
    doc.setFontSize(9);
    doc.setTextColor(...DARK);
    doc.text(descLines, 40, y + 10);

    if (item.itemType) {
      setFont('normal');
      doc.setFontSize(7);
      doc.setTextColor(...MUTED);
      doc.text(item.itemType.toUpperCase(), 40, y + 10 + descLines.length * 10);
    }

    setFont('normal');
    doc.setFontSize(9);
    doc.setTextColor(...DARK);
    doc.text(String(qty), 305, y + 10, { align: 'center' });
    doc.text(fmt(unit), 358, y + 10, { align: 'right' });
    doc.text(`${gstPct}%`, 436, y + 10, { align: 'right' });

    setFont('bold');
    doc.text(fmt(lineGross), 522, y + 10, { align: 'right' });

    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.25);
    doc.line(40, y + rowHeight - 4, W - 40, y + rowHeight - 4);
    y += rowHeight;
  });

  // ─── TOTALS BLOCK ─────────────────────────────────────────────────────────
  addPageIfNecessary(80); // Totals need about 80pt
  y += 12;

  const totX = 522; // right-aligned matches amount column
  const totLabelX = 405; // left-aligned label within block

  const subtotal = parseFloat(invoice.subtotal) || 0;
  const taxTotal = parseFloat(invoice.taxTotal) || 0;
  const total = parseFloat(invoice.total) || (subtotal + taxTotal);

  const payStatus = (invoice.paymentStatus || '').toUpperCase();
  const isPaid = (payStatus === 'PAID');
  const amtPaid = isPaid ? total : (parseFloat(invoice.amountPaid) || 0);
  const amtDue = total - amtPaid;

  const totRows = [
    { label: 'Subtotal', val: fmt(subtotal), bold: false },
    { label: `GST (${invoice.taxPercentage || 18}%)`, val: fmt(taxTotal), bold: false },
    { label: 'Total', val: fmt(total), bold: true },
    ...(isPaid ? [{ label: 'Amount Paid', val: `- ${fmt(amtPaid)}`, bold: false, color: GREEN }] : []),
  ];

  totRows.forEach(({ label, val, bold, color }) => {
    setFont(bold ? 'bold' : 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...(color ? color : MUTED));
    doc.text(label, totLabelX, y); // left aligned label

    doc.setTextColor(...(color ? color : DARK));
    doc.text(val, totX, y, { align: 'right' });
    y += 16;
  });

  // Amount Due highlight box (x=395-556)
  addPageIfNecessary(50);
  doc.setFillColor(...DARK);
  doc.roundedRect(395, y - 4, 556 - 395, 30, 4, 4, 'F');
  setFont('bold');
  doc.setFontSize(11);
  doc.setTextColor(...WHITE);
  doc.text('Amount Due', 405, y + 16);
  doc.text(fmt(amtDue), 545, y + 16, { align: 'right' });
  y += 44;

  // ─── NOTES / FOOTER ───────────────────────────────────────────────────────
  addPageIfNecessary(50);
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.5);
  doc.line(40, y, W - 40, y);
  y += 16;

  setFont('normal');
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text('Thank you for your business. Payment is due by the date shown above.', 40, y);
  y += 12;

  const tenantEmail = invoice.tenantEmail || 'billing@opz.io';
  const tenantWebsite = invoice.tenantWebsite || 'support.opz.io';
  doc.text(`For queries, contact ${tenantEmail} or visit ${tenantWebsite}`, 40, y);

  drawFooter();

  // ─── DOWNLOAD ─────────────────────────────────────────────────────────────
  const filename = `Invoice_${invoice.id || 'draft'}.pdf`;
  doc.save(filename);
  return filename;
}
