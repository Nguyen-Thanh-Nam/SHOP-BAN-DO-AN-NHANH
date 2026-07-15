const fs = require('fs');
const path = require('path');

const dir = 'd:/CMC/OFFENSIVE/ShopGaRan/frontend/src/app/admin';

// Revert and patch to exact afternoon state
const folders = fs.readdirSync(dir);
for (const folder of folders) {
    const stat = fs.statSync(path.join(dir, folder));
    if (!stat.isDirectory()) continue;
    
    const pagePath = path.join(dir, folder, 'page.js');
    if (fs.existsSync(pagePath)) {
        let content = fs.readFileSync(pagePath, 'utf8');
        let changed = false;

        // If it was changed to w-full by patch_width.js, change it back to afternoon state
        if (content.includes('className="w-full flex-1 flex flex-col"')) {
            content = content.replace(
                /className="w-full flex-1 flex flex-col"/g,
                'className="max-w-8xl mx-auto space-y-8 w-full flex-1 flex flex-col"'
            );
            changed = true;
        } else if (content.includes('className="w-full"')) {
            // For pages that didn't get flex-1 flex flex-col yet
            content = content.replace(
                /className="w-full"/g,
                'className="max-w-8xl mx-auto space-y-8 w-full flex-1 flex flex-col"'
            );
            changed = true;
        } else if (content.includes('className="max-w-8xl mx-auto flex-1 flex flex-col"')) {
             content = content.replace(
                /className="max-w-8xl mx-auto flex-1 flex flex-col"/g,
                'className="max-w-8xl mx-auto space-y-8 w-full flex-1 flex flex-col"'
            );
            changed = true;
        } else if (content.includes('className="max-w-8xl mx-auto"')) {
            content = content.replace(
                /className="max-w-8xl mx-auto"/g,
                'className="max-w-8xl mx-auto space-y-8 w-full flex-1 flex flex-col"'
            );
            changed = true;
        }

        if (changed) {
            fs.writeFileSync(pagePath, content, 'utf8');
            console.log('Patched afternoon style in ' + folder + '/page.js');
        }
    }
}

// Dashboard
const dashboardPath = path.join(dir, 'page.js');
if (fs.existsSync(dashboardPath)) {
    let content = fs.readFileSync(dashboardPath, 'utf8');
    let changed = false;
    
    if (content.includes('className="w-full flex-1 flex flex-col"')) {
        content = content.replace(
            /className="w-full flex-1 flex flex-col"/g,
            'className="max-w-8xl mx-auto space-y-8 w-full flex-1 flex flex-col"'
        );
        changed = true;
    } else if (content.includes('className="w-full"')) {
        content = content.replace(
            /className="w-full"/g,
            'className="max-w-8xl mx-auto space-y-8 w-full flex-1 flex flex-col"'
        );
        changed = true;
    } else if (content.includes('className="max-w-8xl mx-auto space-y-8 flex-1 flex flex-col"')) {
        content = content.replace(
            /className="max-w-8xl mx-auto space-y-8 flex-1 flex flex-col"/g,
            'className="max-w-8xl mx-auto space-y-8 w-full flex-1 flex flex-col"'
        );
        changed = true;
    } else if (content.includes('className="max-w-8xl mx-auto space-y-8"')) {
        content = content.replace(
            /className="max-w-8xl mx-auto space-y-8"/g,
            'className="max-w-8xl mx-auto space-y-8 w-full flex-1 flex flex-col"'
        );
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(dashboardPath, content, 'utf8');
        console.log('Patched afternoon style in Dashboard page.js');
    }
}
