const fs = require('fs');
const path = 'd:/managemyfinance/frontend/src/index.css';
let content = fs.readFileSync(path, 'utf8');

const replacements = [
    { regex: /bg-accent-hover/g, replacement: 'bg-primary-hover' },
    { regex: /border-accent-hover/g, replacement: 'border-primary-hover' },
    { regex: /text-accent-hover/g, replacement: 'text-primary-hover' },
    { regex: /ring-accent-light/g, replacement: 'ring-primary-light' },
    { regex: /bg-accent/g, replacement: 'bg-primary' },
    { regex: /text-accent/g, replacement: 'text-primary' },
    { regex: /border-accent/g, replacement: 'border-primary' },
    { regex: /ring-accent/g, replacement: 'ring-primary' },
    { regex: /bg-bg/g, replacement: 'bg-workspace' },
    { regex: /bg-\[\#F8F9FB\]/g, replacement: 'bg-workspace' },
    { regex: /rounded-md/g, replacement: 'rounded-button' },
    { regex: /rounded-lg/g, replacement: 'rounded-card' },
    { regex: /rounded-xl/g, replacement: 'rounded-card' },
    { regex: /shadow-sm/g, replacement: 'shadow-card' },
    { regex: /shadow-md/g, replacement: 'shadow-card' },
    { regex: /border-border/g, replacement: 'border-gray-border' },
    { regex: /border-border-strong/g, replacement: 'border-gray-border' },
    { regex: /divide-border/g, replacement: 'divide-gray-divider' },
];

let newContent = content;
for (const { regex, replacement } of replacements) {
    newContent = newContent.replace(regex, replacement);
}

if (content !== newContent) {
    fs.writeFileSync(path, newContent, 'utf8');
    console.log('Patched index.css');
}
