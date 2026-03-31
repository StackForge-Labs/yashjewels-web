const fs = require('fs');
const html = fs.readFileSync('reference.html', 'utf8');
const urls = [...new Set(html.match(/https:\/\/tamluxury\.vn\/wp-content\/uploads\/[^\s"'<>]+\.(jpg)/gi))];
const productUrls = urls.filter(u => !u.includes('BANNER') && !u.includes('banner') && !u.includes('-min'));
console.log(productUrls.slice(0, 30).join('\n'));
