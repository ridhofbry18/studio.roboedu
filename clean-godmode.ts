import fs from 'fs';
import path from 'path';

function removeGodMode(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      removeGodMode(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      if (content.includes('god_mode_role') || content.includes('godModeRole') || content.includes('isGodMode') || content.includes('effectiveRole')) {
        // Remove cookie getting
        content = content.replace(/const godModeRole\s*=\s*cookieStore\.get\([^)]+\)\?\.value\s*\|\|\s*"none";\s*/g, '');
        content = content.replace(/const godModeTeam\s*=\s*cookieStore\.get\([^)]+\)\?\.value\s*\|\|\s*"none";\s*/g, '');
        
        // Remove isGodMode
        content = content.replace(/const isGodMode\s*=\s*godModeRole\s*!==\s*"none";\s*/g, '');
        
        // Replace effectiveRole with user.role
        content = content.replace(/const effectiveRole\s*=\s*isGodMode\s*\?\s*godModeRole\s*:\s*user\.role;\s*/g, '');
        content = content.replace(/effectiveRole/g, 'user.role');
        
        // Replace godModeTeam overrides
        content = content.replace(/const effectiveTeam\s*=\s*isGodMode\s*&&\s*godModeTeam\s*!==\s*"none"\s*\?\s*godModeTeam\s*:\s*user\.teamId;\s*/g, '');
        content = content.replace(/effectiveTeam/g, 'user.teamId');
        
        // DashboardLayout specific
        content = content.replace(/const \[godModeRole, setGodModeRole\] = useState<string>\("none"\);\s*/g, '');
        content = content.replace(/const \[godModeTeam, setGodModeTeam\] = useState<string>\("none"\);\s*/g, '');
        
        content = content.replace(/if\s*\(match\)\s*setGodModeRole\(match\[2\]\);\s*/g, '');
        content = content.replace(/if\s*\(teamMatch\)\s*setGodModeTeam\(teamMatch\[2\]\);\s*/g, '');
        
        content = content.replace(/const effectiveRole\s*=\s*godModeRole\s*!==\s*"none"\s*\?\s*godModeRole\s*:\s*\(session\?\.user\s*as\s*any\)\?\.role;\s*/g, 'const effectiveRole = (session?.user as any)?.role;\n');
        
        content = content.replace(/const effectiveName\s*=\s*godModeRole\s*!==\s*"none"\s*\?\s*"God Mode "\s*\+\s*godModeRole\.toUpperCase\(\)\s*:\s*session\?\.user\?\.name;\s*/g, 'const effectiveName = session?.user?.name;\n');

        // Dashboard badge text
        content = content.replace(/\{godModeRole !== 'none' \? 'text-rose-500 animate-pulse' : 'text-amber-500'\}/g, 'text-amber-500');
        content = content.replace(/\{\(\(session\?\.user as any\)\?\.teamId \|\| godModeRole !== 'none'\) && ` • \$\{godModeRole !== 'none' \? \(godModeRole === 'anggota' && godModeTeam !== 'none' \? 'Team: ' \+ godModeTeam : 'ALL DIVISIONS'\) : \(session\?\.user as any\)\?\.teamId\}`\}/g, '{((session?.user as any)?.teamId) && ` • ${(session?.user as any)?.teamId}`}');
        
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Cleaned:', fullPath);
      }
    }
  }
}

removeGodMode(path.join(process.cwd(), 'src/app'));
removeGodMode(path.join(process.cwd(), 'src/components/dashboard'));
