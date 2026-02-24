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

            if (code.match(/const\s+router\s*=\s*useNavigate\(\)/)) {
                code = code.replace(/const\s+router\s*=\s*useNavigate\(\)/g, 'const navigate = useNavigate()');
                code = code.replace(/router\.replace\((['"][^'"]+['"])\)/g, 'navigate($1, { replace: true })');
                code = code.replace(/router\(/g, 'navigate(');
                code = code.replace(/router/g, 'navigate'); // Replace leftover `router` occurrences like in dependency arrays

                fs.writeFileSync(fullPath, code);
                console.log(`Fixed routing in ${fullPath}`);
            }
        }
    }
}

processDir(path.join(__dirname, 'src'));
console.log('Finished fixing router.replace');
