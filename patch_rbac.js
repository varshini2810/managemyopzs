const fs = require('fs');
const path = require('path');

const files = [
  'frontend/src/components/layout/Sidebar.jsx',
  'frontend/src/components/layout/TopNavbar.jsx',
  'frontend/src/pages/Settings/SettingsLayout.jsx',
  'frontend/src/pages/Customers/CustomerDetail.jsx',
  'frontend/src/components/layout/Topbar.jsx'
];

files.forEach(f => {
  const fp = path.join('d:/managemyfinance', f);
  if (!fs.existsSync(fp)) return;
  
  let content = fs.readFileSync(fp, 'utf8');
  const original = content;

  if (!content.includes('hasMinRole')) {
    content = content.replace(/import React/, "import { hasMinRole } from '../../utils/rbac';\nimport React");
  }

  // user?.role === "ULTRASUPERADMIN"
  content = content.replace(/user\?\.role === "ULTRASUPERADMIN"/g, 'hasMinRole(user?.role, "ULTRASUPERADMIN")');
  
  // user.role === "ULTRASUPERADMIN" || user.role === "SUPERADMIN"
  content = content.replace(/user\.role === "ULTRASUPERADMIN" \|\| user\.role === "SUPERADMIN"/g, 'hasMinRole(user?.role, "SUPERADMIN")');
  
  // user?.role !== "USER"
  content = content.replace(/user\?\.role !== "USER"/g, 'hasMinRole(user?.role, "ADMIN")');
  
  // user?.role !== "ULTRASUPERADMIN"
  content = content.replace(/user\?\.role !== "ULTRASUPERADMIN"/g, '!hasMinRole(user?.role, "ULTRASUPERADMIN")');

  if (original !== content) {
    fs.writeFileSync(fp, content, 'utf8');
    console.log('Updated ' + f);
  }
});
