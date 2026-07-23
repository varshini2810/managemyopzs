const fs = require('fs');
let file = fs.readFileSync('frontend/src/pages/Expenses/Expenses.jsx', 'utf8');

if (!file.includes('<GlobalTenantGuard')) {
  file = file.replace('import {', 'import GlobalTenantGuard from "../../components/common/GlobalTenantGuard";\nimport {');
  
  file = file.replace('  return (\n    <div\n      className="min-h-full"', '  return (\n    <GlobalTenantGuard actionLabel="manage expenses">\n    <div\n      className="min-h-full"');
  
  // The end of the file is:
  //       />{" "}\n    </div>\n  );\n}
  
  file = file.replace('/>{" "}\n    </div>\n  );\n}', '/>{" "}\n    </div>\n    </GlobalTenantGuard>\n  );\n}');
  
  fs.writeFileSync('frontend/src/pages/Expenses/Expenses.jsx', file);
  console.log('Fixed Expenses.jsx cleanly');
}
