const fs = require('fs');

const files = [
  'd:/managemyfinance/frontend/src/pages/Subscriptions/CreateSubscription.jsx',
  'd:/managemyfinance/frontend/src/pages/ProductCatalog/Plans/CreatePlanModal.jsx',
  'd:/managemyfinance/frontend/src/pages/ProductCatalog/Coupons/CreateCouponModal.jsx',
  'd:/managemyfinance/frontend/src/pages/ProductCatalog/Charges/CreateChargeModal.jsx',
  'd:/managemyfinance/frontend/src/pages/ProductCatalog/Addons/CreateAddonModal.jsx',
  'd:/managemyfinance/frontend/src/pages/ProductCatalog/ProductFamilies/CreateFamilyModal.jsx',
  'd:/managemyfinance/frontend/src/pages/Settings/Taxes/CreateTaxRegionModal.jsx',
  'd:/managemyfinance/frontend/src/pages/Settings/Webhooks/CreateWebhookModal.jsx',
  'd:/managemyfinance/frontend/src/pages/Settings/ApiKeys/CreateApiKeyModal.jsx',
  'd:/managemyfinance/frontend/src/pages/Settings/PaymentGateways/PaymentGateways.jsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('GlobalTenantGuard')) continue;

  const depth = file.split('frontend/src/')[1].split('/').length - 1;
  const importPath = '../'.repeat(depth) + 'components/common/GlobalTenantGuard';
  
  content = content.replace(/(import .* from .*;)/, `$1\nimport GlobalTenantGuard from "${importPath}";`);
  
  // Wrap return logic (heuristic)
  if (content.includes('if (!isOpen) return null;')) {
    content = content.replace('if (!isOpen) return null;\n', `if (!isOpen) return null;\n\n  return (\n    <GlobalTenantGuard actionLabel="perform this action">\n      {/* Guard wrapped by script */}\n`);
    // Find last </div> ); and replace with </div></GlobalTenantGuard>);
    const lastDivIndex = content.lastIndexOf('</div>');
    if (lastDivIndex !== -1) {
       content = content.slice(0, lastDivIndex + 6) + '\n    </GlobalTenantGuard>' + content.slice(lastDivIndex + 6);
    }
  } else if (content.includes('return (\n    <div>')) { // For pages like CreateSubscription
     content = content.replace('return (\n    <div>', `return (\n    <GlobalTenantGuard actionLabel="perform this action">\n    <div>`);
     const lastDivIndex = content.lastIndexOf('</div>');
     if (lastDivIndex !== -1) {
       content = content.slice(0, lastDivIndex + 6) + '\n    </GlobalTenantGuard>' + content.slice(lastDivIndex + 6);
     }
  } else if (content.includes('return (\n    <div')) {
     content = content.replace('return (\n    <div', `return (\n    <GlobalTenantGuard actionLabel="perform this action">\n    <div`);
     const lastDivIndex = content.lastIndexOf('</div>');
     if (lastDivIndex !== -1) {
       content = content.slice(0, lastDivIndex + 6) + '\n    </GlobalTenantGuard>' + content.slice(lastDivIndex + 6);
     }
  }
  
  fs.writeFileSync(file, content);
  console.log('Patched: ' + file);
}
