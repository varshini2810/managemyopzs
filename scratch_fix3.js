const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.js')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const pages = walkSync('d:/managemyfinance/frontend/src/pages');
const components = walkSync('d:/managemyfinance/frontend/src/components');
const allFiles = [...pages, ...components];

let modifiedFiles = new Set();
let replacements = [];

allFiles.forEach(file => {
  let originalContent = fs.readFileSync(file, 'utf8');
  let newContent = originalContent;
  let lines = newContent.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let originalLine = line;

    if (line.includes('bg-stone-50')) {
      line = line.replace(/bg-stone-50/g, 'bg-bg-main');
    }

    // Replace manual rounded classes safely
    const roundedRegex = /(?<![a-zA-Z0-9_-])(rounded(?:-md|-lg|-xl)?)(?![a-zA-Z0-9_-])/g;
    if (roundedRegex.test(line)) {
      if (line.toLowerCase().includes('input') || line.toLowerCase().includes('select') || line.toLowerCase().includes('textarea')) {
        line = line.replace(roundedRegex, 'rounded-input');
      } else if (line.toLowerCase().includes('button') || line.toLowerCase().includes('btn')) {
        line = line.replace(roundedRegex, 'rounded-button');
      } else {
        line = line.replace(roundedRegex, 'rounded-card');
      }
    }

    if (line !== originalLine) {
      lines[i] = line;
      modifiedFiles.add(file);
      replacements.push({
        file: file.replace('d:\\managemyfinance\\frontend\\', ''),
        original: originalLine.trim(),
        new: line.trim()
      });
    }
  }

  if (modifiedFiles.has(file)) {
    fs.writeFileSync(file, lines.join('\n'));
  }
});

console.log(JSON.stringify(replacements, null, 2));
