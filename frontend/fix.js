import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir('src/pages', (filePath) => {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content
      .replace(/..\/..\/common\/DataTable/g, '../../../components/common/DataTable')
      .replace(/..\/..\/common\/EmptyState/g, '../../../components/common/EmptyState');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
    }
  }
});

const metricChart = 'src/components/charts/MetricChart.jsx';
if (fs.existsSync(metricChart)) {
  let content = fs.readFileSync(metricChart, 'utf8');
  let newContent = content.replace(/..\/..\/..\/services\/api/g, '../../services/api');
  fs.writeFileSync(metricChart, newContent);
}
console.log('Done fixing imports');
