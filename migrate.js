const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend_old', 'src', 'pages');
const destDir = path.join(__dirname, 'frontend', 'app');

const files = fs.readdirSync(srcDir);

const routeMap = {
  'LandingPage.jsx': '', // root
  'DashboardPage.jsx': 'dashboard',
  'AdminPage.jsx': 'admin',
  'CommunityAlertsPage.jsx': 'alerts',
  'MapPage.jsx': 'map',
  'ProfilePage.jsx': 'profile',
  'ReportIncidentPage.jsx': 'report',
  'SOSPage.jsx': 'sos'
};

files.forEach(file => {
  if (file === 'LoginPage.jsx') return; // Skip login
  if (!routeMap.hasOwnProperty(file)) return;

  const content = fs.readFileSync(path.join(srcDir, file), 'utf-8');

  // Replace react-router-dom with next
  let newContent = content
    .replace(/import\s+\{([^}]+)\}\s+from\s+['"]react-router-dom['"]/g, (match, importsStr) => {
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

  // Add use client
  newContent = '"use client";\n\n' + newContent;

  const route = routeMap[file];
  const targetDir = route === '' ? destDir : path.join(destDir, route);
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Next.js app router uses page.js or page.jsx for routes
  const destFile = path.join(targetDir, 'page.jsx');
  fs.writeFileSync(destFile, newContent);
  console.log(`Migrated ${file} to ${route}/page.jsx`);
});
