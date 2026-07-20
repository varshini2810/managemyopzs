const fs = require('fs');

const files = [
  'd:/managemyfinance/frontend/src/pages/ProductCatalog/Coupons/CreateCouponModal.jsx',
  'd:/managemyfinance/frontend/src/pages/ProductCatalog/Addons/CreateAddonModal.jsx',
  'd:/managemyfinance/frontend/src/pages/ProductCatalog/ProductFamilies/CreateFamilyModal.jsx',
  'd:/managemyfinance/frontend/src/pages/Settings/Taxes/CreateTaxRegionModal.jsx',
  'd:/managemyfinance/frontend/src/pages/Settings/Webhooks/CreateWebhookModal.jsx',
  'd:/managemyfinance/frontend/src/pages/Settings/ApiKeys/CreateApiKeyModal.jsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('GlobalTenantGuard')) {
    // Determine depth for import
    let importPath = "../../../components/common/GlobalTenantGuard";
    if (file.includes("Settings/Webhooks") || file.includes("Settings/ApiKeys") || file.includes("Settings/Taxes") || file.includes("ProductCatalog/Coupons") || file.includes("ProductCatalog/Addons") || file.includes("ProductCatalog/ProductFamilies")) {
      importPath = "../../../components/common/GlobalTenantGuard";
    }
    
    // Add import
    content = content.replace('import api from', `import GlobalTenantGuard from "${importPath}";\nimport api from`);
    if (!content.includes(importPath)) {
        content = content.replace('import {', `import GlobalTenantGuard from "${importPath}";\nimport {`);
    }
    
    // Wrap form
    content = content.replace('<form', '<GlobalTenantGuard actionLabel="perform action">\n      <form');
    content = content.replace('</form>', '</form>\n      </GlobalTenantGuard>');
    
    fs.writeFileSync(file, content);
    console.log('Fixed ' + file);
  }
}
