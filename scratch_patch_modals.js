const fs = require('fs');

const files = [
  'd:/managemyfinance/frontend/src/pages/ProductCatalog/Coupons/CreateCouponModal.jsx',
  'd:/managemyfinance/frontend/src/pages/ProductCatalog/Charges/CreateChargeModal.jsx',
  'd:/managemyfinance/frontend/src/pages/ProductCatalog/Addons/CreateAddonModal.jsx',
  'd:/managemyfinance/frontend/src/pages/ProductCatalog/ProductFamilies/CreateFamilyModal.jsx',
  'd:/managemyfinance/frontend/src/pages/Settings/Taxes/CreateTaxRegionModal.jsx',
  'd:/managemyfinance/frontend/src/pages/Settings/Webhooks/CreateWebhookModal.jsx',
  'd:/managemyfinance/frontend/src/pages/Settings/ApiKeys/CreateApiKeyModal.jsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('actionLabel="perform this action"')) {
     continue; // already wrapped
  }

  // Modals pattern: 
  // if (!isOpen) return null;
  // ...
  // return (
  //   <div
  
  // We will replace the first `return (\r\n    <div` or `return (\n    <div` with the wrapper
  // But wait, the file might have the wrapper on the `div` inside `return`
  
  content = content.replace(/return\s*\(\s*(<div[^>]*>)/i, 'return (\n    <GlobalTenantGuard actionLabel="perform this action">\n    $1');
  
  // Find last </div> ); and replace with </div></GlobalTenantGuard>);
  const lastDivIndex = content.lastIndexOf('</div>');
  if (lastDivIndex !== -1) {
      content = content.slice(0, lastDivIndex + 6) + '\n    </GlobalTenantGuard>' + content.slice(lastDivIndex + 6);
  }
  
  fs.writeFileSync(file, content);
  console.log('Patched: ' + file);
}
