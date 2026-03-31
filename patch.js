const fs = require('fs');

const pageFile = 'src/app/page.tsx';
let lines = fs.readFileSync(pageFile, 'utf8').split('\n');

const startIndex = lines.findIndex(line => line.includes('{/* Hero Banner with Cinematic Fade */}'));
const endIndex = lines.findIndex(line => line.includes('{/* Main Footer (Fixed Logos) */}'));

if (startIndex !== -1 && endIndex !== -1) {
    const importStatement = 'import { HomeViews } from "../components/HomeViews";';
    let topPart = lines.slice(0, startIndex);
    
    const reactImportIndex = topPart.findIndex(line => line.includes('import React'));
    if (reactImportIndex !== -1) {
        topPart.splice(reactImportIndex + 1, 0, importStatement);
    }
    
    // The previous Home component returns its diamonds array inside it. We pass it like <HomeViews diamonds={diamonds} />
    const bottomPart = lines.slice(endIndex);
    
    const newFileContent = [...topPart, '            <HomeViews diamonds={diamonds} />', '', ...bottomPart].join('\n');
    fs.writeFileSync(pageFile, newFileContent, 'utf8');
    console.log('Successfully patched page.tsx!');
} else {
    console.error('Could not find start or end index.', startIndex, endIndex);
}
