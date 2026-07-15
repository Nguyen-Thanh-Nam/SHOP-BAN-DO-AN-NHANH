const fs = require('fs');
const path = require('path');

const dir = 'd:/CMC/OFFENSIVE/ShopGaRan/frontend/src/app/admin';

// 2. Patch all page.js
const folders = fs.readdirSync(dir);
for (const folder of folders) {
    const stat = fs.statSync(path.join(dir, folder));
    if (!stat.isDirectory()) continue;
    
    const pagePath = path.join(dir, folder, 'page.js');
    if (fs.existsSync(pagePath)) {
        let content = fs.readFileSync(pagePath, 'utf8');
        let changed = false;

        // Fix max-w-8xl mx-auto wrapper
        if (content.includes('max-w-8xl mx-auto')) {
            content = content.replace(
                /max-w-8xl mx-auto/g,
                'w-full'
            );
            changed = true;
        }
        
        // Also fix max-w-7xl mx-auto if any
        if (content.includes('max-w-7xl mx-auto')) {
            content = content.replace(
                /max-w-7xl mx-auto/g,
                'w-full'
            );
            changed = true;
        }

        if (changed) {
            fs.writeFileSync(pagePath, content, 'utf8');
            console.log('Patched width in ' + folder + '/page.js');
        }
    }
}

// Also check the root admin page (Dashboard)
const dashboardPath = path.join(dir, 'page.js');
if (fs.existsSync(dashboardPath)) {
    let content = fs.readFileSync(dashboardPath, 'utf8');
    let changed = false;
    if (content.includes('max-w-8xl mx-auto')) {
        content = content.replace(/max-w-8xl mx-auto/g, 'w-full');
        changed = true;
    }
    if (content.includes('max-w-7xl mx-auto')) {
        content = content.replace(/max-w-7xl mx-auto/g, 'w-full');
        changed = true;
    }
    if (changed) {
        fs.writeFileSync(dashboardPath, content, 'utf8');
        console.log('Patched width in Dashboard page.js');
    }
}
