const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            const code = fs.readFileSync(fullPath, 'utf8');
            try {
                const result = babel.transformSync(code, {
                    filename: fullPath,
                    presets: [
                        ['@babel/preset-typescript', { isTSX: true, allExtensions: true }]
                    ],
                    plugins: [
                        '@babel/plugin-syntax-jsx'
                    ],
                    ast: false,
                    code: true,
                    retainLines: true
                });

                if (result && result.code) {
                    const newExt = fullPath.endsWith('.tsx') ? '.jsx' : '.js';
                    const newPath = fullPath.replace(/\.tsx?$/, newExt);
                    // remove empty type imports that look like: import { ... } from '...'; if they are empty
                    let cleanCode = result.code.replace(/import\s*{\s*}\s*from\s*['"][^'"]+['"];?/g, '');
                    fs.writeFileSync(newPath, cleanCode);
                    fs.unlinkSync(fullPath);
                    console.log(`Converted ${fullPath} to ${newExt}`);
                }
            } catch (e) {
                console.error(`Failed to convert ${fullPath}`);
                console.error(e);
            }
        }
    }
}

processDir(path.join(__dirname, 'src', 'components'));
processDir(path.join(__dirname, 'src', 'app')); // if it exists
processDir(path.join(__dirname, 'src', 'context')); // if it exists
processDir(path.join(__dirname, 'src', 'lib')); // if it exists
console.log('Done!');
