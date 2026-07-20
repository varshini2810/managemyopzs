const fs = require('fs');
const file = 'd:\\managemyfinance\\frontend\\src\\pages\\InvoiceManagement\\InvoiceManagement.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { jsPDF }') && !content.includes('import jsPDF')) {
    content = content.replace('import React', 'import jsPDF from "jspdf";\nimport React');
}

const pdfFunction = 
  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text('INVOICE', 14, 20);
      
      doc.setFontSize(10);
      doc.text(\Invoice #: \\, 14, 30);
      doc.text(\Status: \\, 14, 36);
      doc.text(\Date: \\, 14, 42);
      doc.text(\Due: \\, 14, 48);

      doc.setFontSize(12);
      doc.text("Billed To:", 120, 30);
      doc.setFontSize(10);
      doc.text(inv.client, 120, 36);
      if (inv.company) doc.text(inv.company, 120, 42);
      if (inv.email) doc.text(inv.email, 120, 48);
      
      let y = 65;
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text("Description", 14, y);
      doc.text("Qty", 100, y);
      doc.text("Price", 130, y);
      doc.text("Amount", 170, y);
      
      doc.setFont(undefined, 'normal');
      y += 8;
      
      (inv.items || []).forEach(item => {
        const lineAmt = (item.qty || 0) * (item.price || 0);
        doc.text(item.desc || "Item", 14, y);
        doc.text(String(item.qty || 0), 100, y);
        doc.text(\$\\, 130, y);
        doc.text(\$\\, 170, y);
        y += 8;
      });
      
      y += 10;
      doc.setFont(undefined, 'bold');
      doc.text(\Subtotal: $\\, 130, y);
      y += 8;
      doc.text(\Tax: $\\, 130, y);
      y += 8;
      doc.text(\Discount: $\\, 130, y);
      y += 10;
      doc.setFontSize(14);
      doc.text(\Total: $\\, 130, y);
      
      doc.save(\Invoice_\.pdf\);
      toast.success("PDF downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF");
    }
  };
;

const viewModalStr = 'function ViewModal({ open, invoice: inv, onClose, onEdit, onRecordPayment }) {';
if (!content.includes('handleDownloadPDF')) {
    content = content.replace(viewModalStr, viewModalStr + '\n' + pdfFunction);
}

const oldPdfButton = \onClick={() => {
                  toast.success("PDF downloaded");
                  onClose();
                }}\;
const newPdfButton = \onClick={() => {
                  handleDownloadPDF();
                  onClose();
                }}\;

content = content.replace(oldPdfButton, newPdfButton);

fs.writeFileSync(file, content, 'utf8');
console.log('PDF logic injected');
