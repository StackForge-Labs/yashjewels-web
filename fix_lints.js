const fs = require('fs');
let content = fs.readFileSync('src/components/HomeViews.tsx', 'utf8');

content = content.replace(/bg-gradient-to-r/g, 'bg-linear-to-r');
content = content.replace(/bg-gradient-to-t/g, 'bg-linear-to-t');
content = content.replace(/bg-gradient-to-br/g, 'bg-linear-to-br');
content = content.replace(/cursor-pointer cursor-pointer/g, 'cursor-pointer');
content = content.replace(/h-\[1px\]/g, 'h-px');

fs.writeFileSync('src/components/HomeViews.tsx', content);
console.log('Fixed lints.');
