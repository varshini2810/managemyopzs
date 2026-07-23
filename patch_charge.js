const fs = require('fs');
let file = fs.readFileSync('frontend/src/pages/ProductCatalog/Charges/CreateChargeModal.jsx', 'utf8');
if (!file.includes('GlobalTenantGuard')) {
  file = file.replace('import api from', 'import GlobalTenantGuard from "../../../components/common/GlobalTenantGuard";\nimport api from');
  
  file = file.replace('<form', '<GlobalTenantGuard actionLabel="create charges">\n      <form');
  
  file = file.replace('</form>', '</form>\n      </GlobalTenantGuard>');
  
  fs.writeFileSync('frontend/src/pages/ProductCatalog/Charges/CreateChargeModal.jsx', file);
  console.log('Fixed CreateChargeModal.jsx');
}
