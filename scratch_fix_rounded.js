const fs = require('fs');
const path = require('path');

function walkSync(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      filelist = walkSync(p, filelist);
    } else if (p.endsWith('.jsx') || p.endsWith('.js')) {
      filelist.push(p);
    }
  });
  return filelist;
}

const allFiles = [...walkSync('d:/managemyfinance/frontend/src/pages'), ...walkSync('d:/managemyfinance/frontend/src/components')];

let replacements = [];

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  let regex = /rounded-card/g;
  let match;
  let changes = [];
  
  while ((match = regex.exec(content)) !== null) {
    let index = match.index;
    
    let i = index;
    let tagStartIndex = -1;
    let foundTag = false;
    let lookBehindLimit = 600; 
    
    while (i >= 0 && lookBehindLimit > 0) {
      if (content[i] === '<' && content[i+1] !== '/') {
        tagStartIndex = i;
        foundTag = true;
        break;
      }
      if (content[i] === '>') {
        break;
      }
      i--;
      lookBehindLimit--;
    }
    
    if (foundTag) {
      let textAfterAngle = content.substring(tagStartIndex + 1, tagStartIndex + 20).toLowerCase();
      let attributesText = content.substring(tagStartIndex, index).toLowerCase();
      
      let replaceWith = null;
      if (textAfterAngle.startsWith('button')) {
        replaceWith = 'rounded-button';
      } else if (textAfterAngle.startsWith('input') || textAfterAngle.startsWith('select') || textAfterAngle.startsWith('textarea')) {
        replaceWith = 'rounded-input';
      } else if (attributesText.includes('btn') || attributesText.includes('button')) {
        replaceWith = 'rounded-button';
      }
      
      // Additional heuristic: if class name contains "input", maybe it's an input-like div
      if (!replaceWith && attributesText.includes('className=') && attributesText.includes('\"input')) {
        replaceWith = 'rounded-input';
      }
      
      if (replaceWith) {
        changes.push({ index, replaceWith });
      }
    }
  }
  
  if (changes.length > 0) {
    for (let c = changes.length - 1; c >= 0; c--) {
      let { index, replaceWith } = changes[c];
      content = content.substring(0, index) + replaceWith + content.substring(index + 'rounded-card'.length);
      replacements.push({ file, to: replaceWith });
    }
    fs.writeFileSync(file, content);
  }
});

console.log(`Replaced ${replacements.length} instances.`);
let fileSummary = {};
replacements.forEach(r => {
    let f = r.file.split('src')[1];
    if (!fileSummary[f]) fileSummary[f] = [];
    fileSummary[f].push(r.to);
});
console.log(JSON.stringify(fileSummary, null, 2));
