import fs from 'fs';
import path from 'path';

function fixSyntax(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixSyntax(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let original = content;
      content = content.replace(/const user\.role\s*=[^\n]+;\n/g, '');
      content = content.replace(/const teamId\s*=\s*isGodMode\s*&&\s*godModeTeam\s*!==\s*"none"\s*\?\s*godModeTeam\s*:\s*user\?\.teamId;\n/g, 'const teamId = user?.teamId;\n');
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed syntax in:', fullPath);
      }
    }
  }
}
fixSyntax(path.join(process.cwd(), 'src/app'));
