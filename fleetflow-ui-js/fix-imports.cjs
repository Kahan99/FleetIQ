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

            if (code.includes('next/link')) {
                code = code.replace(/import Link from ['"]next\/link['"];?/g, 'import { Link } from "react-router-dom";');
                changed = true;
            }
            if (code.includes('next/navigation')) {
                // replace imports
                code = code.replace(/import\s*{\s*([^}]+)\s*}\s*from\s*['"]next\/navigation['"];?/g, (match, p1) => {
                    let imports = [];
                    if (p1.includes('useRouter')) imports.push('useNavigate');
                    if (p1.includes('usePathname')) imports.push('useLocation');
                    return `import { ${imports.join(', ')} } from "react-router-dom";`;
                });

                // replace usages: const router = useRouter() -> const navigate = useNavigate()
                code = code.replace(/const\s+(\w+)\s*=\s*useRouter\(\)/g, 'const $1 = useNavigate()');
                // usages of router.push -> navigate
                code = code.replace(/(\w+)\.push\(/g, '$1(');

                // usages of usePathname
                code = code.replace(/const\s+(\w+)\s*=\s*usePathname\(\)/g, 'const location = useLocation(); const $1 = location.pathname;');

                changed = true;
            }

            if (code.includes('next/font/google')) {
                code = code.replace(/import\s*{[^}]+}\s*from\s*['"]next\/font\/google['"];?/g, '');
                changed = true;
            }

            if (code.includes('next/image')) {
                code = code.replace(/import Image from ['"]next\/image['"];?/g, '');
                code = code.replace(/<Image([^>]+)\/>/gi, (match, attributes) => {
                    // Remove Next-specific standard Image props if needed, but <img /> works roughly the same
                    return `<img${attributes}/>`;
                });
                changed = true;
            }

            if (changed) {
                fs.writeFileSync(fullPath, code);
                console.log(`Updated imports in ${fullPath}`);
            }
        }
    }
}

processDir(path.join(__dirname, 'src'));
console.log('Finished fixing imports');
