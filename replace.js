const fs = require('fs');
const path = require('path');

const dir = 'd:\\managemyfinance\\frontend\\src';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx') || file.endsWith('.css')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(dir);

let oldHexCount = 0;
let newHexCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Replace accents
    content = content.replace(/bg-accent/g, 'bg-primary');
    content = content.replace(/text-accent/g, 'text-primary');
    content = content.replace(/border-accent/g, 'border-primary');

    // Replace stones
    content = content.replace(/bg-stone-50(?!0)/g, 'bg-bg-main');
    content = content.replace(/bg-stone-100/g, 'bg-bg-main');

    // Track hex values
    const oldHexMatches = content.match(/#4F46E5/gi);
    if (oldHexMatches) oldHexCount += oldHexMatches.length;

    const newHexMatches = content.match(/#586EF0/gi);
    if (newHexMatches) newHexCount += newHexMatches.length;

    // Replace old hex with new hex
    content = content.replace(/#4F46E5/gi, '#586EF0');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
    }
});

console.log('Old Hex (#4F46E5) replaced:', oldHexCount);
console.log('New Hex (#586EF0) found and kept:', newHexCount);
