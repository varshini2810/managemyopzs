const fs = require('fs');
const file = 'd:\\managemyfinance\\frontend\\src\\pages\\InvoiceManagement\\InvoiceManagement.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldButton = \            <button
                onClick={() => {
                  const handleDownloadPDF = () => {
                    const doc = new jsPDF();
                    doc.text(\\\Invoice: \\\\, 10, 10);
                    doc.save(\\\\.pdf\\\);
                  };
                  handleDownloadPDF();
                  onClose();
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-card hover:bg-gray-50 transition-all"
              >\;

const newButton = \            <button
              onClick={() => {
                handleDownloadPDF();
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-card hover:bg-gray-50 transition-all"
            >\;

if (content.includes(oldButton)) {
    content = content.replace(oldButton, newButton);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Button fixed via exact match');
} else {
    // regex fallback
    const regex = /<button[\\s\\n]*onClick=\{\(\) => \{[\\s\\n]*const handleDownloadPDF = \(\) => \{[\\s\\S]*?onClose\(\);\s*\}\}[\\s\\n]*className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-card hover:bg-gray-50 transition-all"[\\s\\n]*>/g;
    content = content.replace(regex, newButton);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Button fixed via regex');
}
