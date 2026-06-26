import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const components = ['DataTable', 'EmptyState', 'Modal', 'StatusBadge', 'MetricCard', 'SlideOver'];

walkDir('src/pages', (filePath) => {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    
    components.forEach(comp => {
      newContent = newContent.replace(new RegExp(`\\.\\.\\/\\.\\.\\/common\\/${comp}`, 'g'), `../../../components/common/${comp}`);
      newContent = newContent.replace(new RegExp(`\\.\\.\\/\\.\\.\\/\\.\\.\\/common\\/${comp}`, 'g'), `../../../../components/common/${comp}`);
    });
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
    }
  }
});
console.log('Done fixing all common imports');
