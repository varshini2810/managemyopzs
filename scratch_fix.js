const fs = require('fs');
const path = require('path');

// 1. Fix tailwind.config.js
let twPath = 'd:/managemyfinance/frontend/tailwind.config.js';
let tw = fs.readFileSync(twPath, 'utf8');

tw = tw.replace(/workspace:\s*'#F4F7FA',\n\s*/, '');
tw = tw.replace(/gray:\s*\{\s*border:\s*'#E5E7EB',\s*divider:\s*'#D9DBE1'\s*\},\n\s*placeholder:\s*'#9CA3AF',/, "gray: { border: '#E5E7EB', divider: '#D9DBE1', placeholder: '#9CA3AF' },");
tw = tw.replace(/bg:\s*'#F8F9FB',/, "bg: { main: '#F4F7FA' },");
tw = tw.replace(/'2xs': \['10px', \{ lineHeight: '14px' \}\],\n\s*'xs':  \['11px', \{ lineHeight: '16px' \}\],\n\s*'sm':  \['13px', \{ lineHeight: '20px' \}\],\n\s*'base': \['14px', \{ lineHeight: '22px' \}\],\n\s*'md':  \['15px', \{ lineHeight: '24px' \}\],\n\s*'lg':  \['16px', \{ lineHeight: '24px' \}\],\n\s*'xl':  \['18px', \{ lineHeight: '28px' \}\],\n\s*'2xl': \['20px', \{ lineHeight: '28px' \}\],\n\s*'3xl': \['24px', \{ lineHeight: '32px' \}\],\n\s*'4xl': \['30px', \{ lineHeight: '36px' \}\],\n\s*'5xl': \['36px', \{ lineHeight: '42px' \}\],/, "");
fs.writeFileSync(twPath, tw);

// 2. Fix StatCard.jsx
let statCardPath = 'd:/managemyfinance/frontend/src/components/layout/StatCard.jsx';
let statCard = fs.readFileSync(statCardPath, 'utf8');
statCard = statCard.replace(/text-\[10px\]/g, 'text-[7px]');
fs.writeFileSync(statCardPath, statCard);

// 4. Fix index.css
let cssPath = 'd:/managemyfinance/frontend/src/index.css';
let css = fs.readFileSync(cssPath, 'utf8');
css = css.replace(/\.accent-bar-accent\s*\{\s*background:\s*#586EF0;\s*\}/, '.accent-bar-accent  { @apply bg-primary; }');
css = css.replace(/bg-stone-100/g, 'bg-bg-main'); // Specifically for .settings-nav-item
fs.writeFileSync(cssPath, css);

console.log('Fixed Tailwind Config, StatCard, and index.css');
