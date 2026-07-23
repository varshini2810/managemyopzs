const fs = require('fs');

let twPath = 'd:/managemyfinance/frontend/tailwind.config.js';
let tw = fs.readFileSync(twPath, 'utf8');

// Replace everything inside fontSize with the exact required object
const newFontSize = `      fontSize: {
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
      },`;

tw = tw.replace(/fontSize:\s*\{[\s\S]*?\},/g, newFontSize);
fs.writeFileSync(twPath, tw);

console.log('Fixed fontSize');
