const fs = require('fs');
const path = require('path');

const dir = 'd:/CMC/OFFENSIVE/ShopGaRan/frontend/src/app/admin';

// 1. Patch layout.js
const layoutPath = path.join(dir, 'layout.js');
if (fs.existsSync(layoutPath)) {
    let content = fs.readFileSync(layoutPath, 'utf8');
    content = content.replace(
        /<main className="flex-1 md:ml-64 min-h-screen">/g,
        '<main className="flex-1 md:ml-64 min-h-screen flex flex-col">'
    );
    fs.writeFileSync(layoutPath, content, 'utf8');
    console.log('Patched layout.js');
}

// 2. Patch all page.js
const folders = fs.readdirSync(dir);
for (const folder of folders) {
    const pagePath = path.join(dir, folder, 'page.js');
    if (fs.existsSync(pagePath)) {
        let content = fs.readFileSync(pagePath, 'utf8');
        
        let changed = false;
        
        if (content.includes('min-h-screen bg-gray-50/50 p-8">')) {
            content = content.replace(
                /className="min-h-screen bg-gray-50\/50 p-8"/g,
                'className="min-h-screen bg-gray-50/50 p-8 flex-1 flex flex-col"'
            );
            changed = true;
        }

        if (content.includes('overflow-hidden flex flex-col min-h-[500px]')) {
            content = content.replace(
                /overflow-hidden flex flex-col min-h-\[500px\]/g,
                'overflow-hidden flex flex-col flex-1 min-h-[500px]'
            );
            changed = true;
        }

        if (content.includes('overflow-hidden flex flex-col min-h-[400px]')) {
            content = content.replace(
                /overflow-hidden flex flex-col min-h-\[400px\]/g,
                'overflow-hidden flex flex-col flex-1 min-h-[400px]'
            );
            changed = true;
        }

        if (changed) {
            fs.writeFileSync(pagePath, content, 'utf8');
            console.log('Patched ' + folder + '/page.js');
        }
    }
}
