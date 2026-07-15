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
        if (content.includes('className="max-w-8xl mx-auto"')) {
            content = content.replace(
                /className="max-w-8xl mx-auto"/g,
                'className="max-w-8xl mx-auto flex-1 flex flex-col"'
            );
            changed = true;
        }

        // Fix overflow-x-auto inside flex-1 table container
        if (content.includes('className="overflow-x-auto"')) {
            content = content.replace(
                /className="overflow-x-auto"/g,
                'className="overflow-x-auto flex-1"'
            );
            changed = true;
        }

        if (changed) {
            fs.writeFileSync(pagePath, content, 'utf8');
            console.log('Patched ' + folder + '/page.js');
        }
    }
}
