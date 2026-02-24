const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

function processDir(dir) {
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
                        // To keep JSX intact, we need @babel/plugin-syntax-jsx
                    ],
                    ast: false,
                    code: true,
                    retainLines: true
                });

                if (result && result.code) {
                    const newExt = fullPath.endsWith('.tsx') ? '.jsx' : '.js';
                    const newPath = fullPath.replace(/\.tsx?$/, newExt);
                    fs.writeFileSync(newPath, result.code);
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
console.log('Done!');
