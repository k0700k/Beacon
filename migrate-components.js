const fs = require('fs');
const path = require('path');

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.isFile() && (fullPath.endsWith('.jsx') || fullPath.endsWith('.js'))) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      let modified = false;

      // Replace react-router-dom with next
      if (content.includes('react-router-dom')) {
        content = content
          .replace(/import\s+\{([^}]+)\}\s+from\s+['"]react-router-dom['"];?/g, (match, importsStr) => {
            let imports = importsStr.split(',').map(s => s.trim());
            let nextImports = [];
            let navImports = [];
            
            if (imports.includes('Link') || imports.includes('NavLink')) {
              nextImports.push('import Link from "next/link";');
            }
            if (imports.includes('useNavigate')) {
              navImports.push('useRouter');
            }
            if (imports.includes('useLocation')) {
              navImports.push('usePathname');
            }
            
            let res = [];
            if (nextImports.length > 0) res.push(...nextImports);
            if (navImports.length > 0) res.push(`import { ${navImports.join(', ')} } from "next/navigation";`);
            
            return res.join('\n');
          })
          .replace(/useNavigate\(\)/g, 'useRouter()')
          .replace(/useLocation\(\)/g, 'usePathname()')
          .replace(/<Link\s+to=/g, '<Link href=')
          .replace(/<NavLink\s+to=/g, '<Link href=')
          .replace(/<\/NavLink>/g, '</Link>');
          
        modified = true;
      }

      // Prepend "use client"; if it uses React hooks and doesn't have it
      if ((content.includes('useState') || content.includes('useEffect') || content.includes('useContext') || content.includes('useAuth') || content.includes('useRouter') || content.includes('usePathname')) && !content.startsWith('"use client"')) {
        content = '"use client";\n\n' + content;
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir(path.join(__dirname, 'frontend', 'components'));
processDir(path.join(__dirname, 'frontend', 'context'));
processDir(path.join(__dirname, 'frontend', 'lib'));
processDir(path.join(__dirname, 'frontend', 'config'));
