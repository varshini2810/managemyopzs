const fs = require('fs');
let content = fs.readFileSync('d:/managemyfinance/frontend/tailwind.config.js', 'utf8');

// Append colors
const newColors = `
        // === ManageMyMarketing Tokens ===
        primary: { DEFAULT: '#586EF0', hover: '#7084F4' },
        danger: { DEFAULT: '#EF4444' },
        workspace: '#F4F7FA',
        gray: { border: '#E5E7EB', divider: '#D9DBE1' },
        placeholder: '#9CA3AF',
        status: {
          campaigns: '#10B981',
          success: '#10B981',
          expenses: '#F59E0B',
          warning: '#F59E0B',
          approvals: '#A855F7',
          creative: '#A855F7',
          information: '#3B82F6',
          general: '#3B82F6'
        },
`;
content = content.replace(/colors:\s*\{/, 'colors: {' + newColors);

// Append fontSizes
const newFontSizes = `
        'xxs': '8px',
        'xs': '9px',
        'xs-role': '10px',
        'sm': '11px',
        'sm-title': '12px',
        'base': '13px',
        'lg': '15px',
        'xl': '17px',
        '2xl': '21px',
        '3xl': '33px',
        '4xl': '35px',
`;
content = content.replace(/fontSize:\s*\{/, 'fontSize: {' + newFontSizes);

// Append borderRadius
const newRadius = `
        'input': '10px',
        'button': '10px',
        'card': '14px',
`;
content = content.replace(/borderRadius:\s*\{/, 'borderRadius: {' + newRadius);

// Append boxShadow
const newShadow = `
        'card': '0 2px 10px rgba(15, 23, 42, 0.08)',
`;
content = content.replace(/boxShadow:\s*\{/, 'boxShadow: {' + newShadow);

fs.writeFileSync('d:/managemyfinance/frontend/tailwind.config.js', content);
console.log('tailwind config updated successfully');
