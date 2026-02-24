const fs = require('fs');
const path = require('path');

function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let code = fs.readFileSync(fullPath, 'utf8');
            let changed = false;

            // Replace href with to in Link tags
            const newCode = code.replace(/<Link([^>]*?)href=/g, '<Link$1to=');
            if (newCode !== code) {
                code = newCode;
                changed = true;
            }

            // Replace process.env with import.meta.env
            if (code.includes('process.env.NEXT_PUBLIC_')) {
                code = code.replace(/process\.env\.NEXT_PUBLIC_([A-Za-z0-9_]+)/g, 'import.meta.env.VITE_$1');
                changed = true;
            }

            if (changed) {
                fs.writeFileSync(fullPath, code);
                console.log(`Updated href and envs in ${fullPath}`);
            }
        }
    }
}

processDir(path.join(__dirname, 'src'));
console.log('Finished fixing hrefs and envs');
