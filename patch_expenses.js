const fs = require('fs');
const file = 'd:/managemyfinance/frontend/src/pages/Expenses/Expenses.jsx';
if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('GlobalTenantGuard')) {
    content = content.replace(/(import .* from .*;)/, `$1\nimport GlobalTenantGuard from "../../components/common/GlobalTenantGuard";`);
    content = content.replace(/return\s*\(\s*(<div[^>]*>)/i, 'return (\n    <GlobalTenantGuard actionLabel="manage expenses">\n    $1');
    const lastDivIndex = content.lastIndexOf('</div>');
    if (lastDivIndex !== -1) {
        content = content.slice(0, lastDivIndex + 6) + '\n    </GlobalTenantGuard>' + content.slice(lastDivIndex + 6);
    }
    fs.writeFileSync(file, content);
    console.log('Patched Expenses');
  }
}
