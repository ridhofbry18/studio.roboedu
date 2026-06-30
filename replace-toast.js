const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    fs.readdirSync(dir).forEach(f => {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            walkDir(p);
        } else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
            let content = fs.readFileSync(p, 'utf8');
            if (content.includes('import { toast } from "sonner"')) {
                content = content.replace(/import \{ toast \} from "sonner";/g, 'import { toast } from "react-toastify";');
                fs.writeFileSync(p, content);
                console.log('Updated ' + p);
            }
        }
    });
}

walkDir('./src');
