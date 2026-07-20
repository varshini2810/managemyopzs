const fs = require('fs');
let file = fs.readFileSync('frontend/src/pages/Settings/PaymentGateways/PaymentGateways.jsx', 'utf8');
if (!file.includes('GlobalTenantGuard')) {
  file = file.replace('import {', 'import GlobalTenantGuard from "../../../components/common/GlobalTenantGuard";\nimport {');
  
  const mainComponentStart = file.indexOf('export default function PaymentGateways');
  const returnStart = file.indexOf('return (', mainComponentStart);
  const nextDiv = file.indexOf('<div', returnStart);
  
  file = file.slice(0, nextDiv) + '<GlobalTenantGuard actionLabel="manage payment gateways">\n      ' + file.slice(nextDiv);
  
  const lastDivIndex = file.lastIndexOf('</div>');
  if (lastDivIndex !== -1) {
      file = file.slice(0, lastDivIndex + 6) + '\n    </GlobalTenantGuard>' + file.slice(lastDivIndex + 6);
  }
  
  fs.writeFileSync('frontend/src/pages/Settings/PaymentGateways/PaymentGateways.jsx', file);
  console.log('Fixed PaymentGateways.jsx');
}
