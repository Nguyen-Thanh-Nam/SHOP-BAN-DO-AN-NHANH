const fs = require('fs');
const path = require('path');

const dir = 'd:/CMC/OFFENSIVE/ShopGaRan/frontend/src/app/admin';

// Make all pages 100% wide and stretch to bottom
const folders = fs.readdirSync(dir);
for (const folder of folders) {
    const stat = fs.statSync(path.join(dir, folder));
    if (!stat.isDirectory()) continue;
    
    const pagePath = path.join(dir, folder, 'page.js');
    if (fs.existsSync(pagePath)) {
        let content = fs.readFileSync(pagePath, 'utf8');
        let changed = false;

        // Strip max-w-8xl and max-w-7xl, ensure w-full flex-1 flex flex-col
        const regexes = [
            /className="max-w-8xl mx-auto space-y-8 w-full flex-1 flex flex-col"/g,
            /className="max-w-7xl mx-auto space-y-8 w-full flex-1 flex flex-col"/g,
            /className="max-w-8xl mx-auto space-y-8"/g,
            /className="max-w-7xl mx-auto space-y-8"/g,
            /className="max-w-8xl mx-auto flex-1 flex flex-col"/g,
            /className="max-w-8xl mx-auto"/g
        ];

        for (const regex of regexes) {
            if (regex.test(content)) {
                content = content.replace(regex, 'className="w-full space-y-8 flex-1 flex flex-col"');
                changed = true;
            }
        }
        
        // Ensure no duplicate w-full
        content = content.replace(/w-full w-full/g, 'w-full');

        if (changed) {
            fs.writeFileSync(pagePath, content, 'utf8');
            console.log('Patched final wide style in ' + folder + '/page.js');
        }
    }
}

// Dashboard
const dashboardPath = path.join(dir, 'page.js');
if (fs.existsSync(dashboardPath)) {
    let content = fs.readFileSync(dashboardPath, 'utf8');
    let changed = false;
    
    const regexes = [
        /className="max-w-8xl mx-auto space-y-8 w-full flex-1 flex flex-col"/g,
        /className="max-w-7xl mx-auto space-y-8 w-full flex-1 flex flex-col"/g,
        /className="max-w-8xl mx-auto space-y-8"/g,
        /className="max-w-7xl mx-auto space-y-8"/g,
        /className="max-w-8xl mx-auto flex-1 flex flex-col"/g,
        /className="max-w-8xl mx-auto"/g
    ];

    for (const regex of regexes) {
        if (regex.test(content)) {
            content = content.replace(regex, 'className="w-full space-y-8 flex-1 flex flex-col"');
            changed = true;
        }
    }
    
    content = content.replace(/w-full w-full/g, 'w-full');

    if (changed) {
        fs.writeFileSync(dashboardPath, content, 'utf8');
        console.log('Patched final wide style in Dashboard page.js');
    }
}
