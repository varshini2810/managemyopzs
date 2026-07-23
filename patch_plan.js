const fs = require('fs');
let file = fs.readFileSync('frontend/src/pages/ProductCatalog/Plans/CreatePlanModal.jsx', 'utf8');
if (!file.includes('GlobalTenantGuard')) {
  file = file.replace('import api from', 'import GlobalTenantGuard from "../../../components/common/GlobalTenantGuard";\nimport api from');
  
  // CreatePlanModal has a StepRail which returns a div. We must replace the Main Component's return div!
  // Main component is "export default function CreatePlanModal".
  
  const mainComponentStart = file.indexOf('export default function CreatePlanModal');
  const returnStart = file.indexOf('return (', mainComponentStart);
  const nextDiv = file.indexOf('<div', returnStart);
  
  file = file.slice(0, nextDiv) + '<GlobalTenantGuard actionLabel="create a plan">\n      ' + file.slice(nextDiv);
  
  const lastDivIndex = file.lastIndexOf('</div>');
  if (lastDivIndex !== -1) {
      file = file.slice(0, lastDivIndex + 6) + '\n    </GlobalTenantGuard>' + file.slice(lastDivIndex + 6);
  }
  
  fs.writeFileSync('frontend/src/pages/ProductCatalog/Plans/CreatePlanModal.jsx', file);
  console.log('Fixed CreatePlanModal.jsx');
}
