const fs = require('fs');

function fixLayout(filePath, role) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace standard user effect
  const oldEffect = `  const [user, setUser] = useState<any>(null);
  useEffect(() => { getCurrentUser().then(setUser); }, []);

  useEffect(() => {
    if (!user || user.role !== "${role}") {
      navigate("/login");
    }
  }, [user, navigate]);`;

  const newEffect = `  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then(u => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading && (!user || user.role !== "${role}")) {
      navigate("/login");
    }
  }, [user, loading, navigate]);`;

  content = content.replace(oldEffect, newEffect);
  
  // Also update the fallback return
  const oldReturn = `if (!user || user.role !== "${role}") return null;`;
  const newReturn = `if (loading || !user || user.role !== "${role}") return null;`;
  content = content.replace(oldReturn, newReturn);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

fixLayout('/Users/mdsunny/Downloads/Dawaighor website/src/app/pages/admin/AdminLayout.tsx', 'admin');
fixLayout('/Users/mdsunny/Downloads/Dawaighor website/src/app/pages/dashboard/UserLayout.tsx', 'user');

// Remove Demo Credentials from Login.tsx
const loginFile = '/Users/mdsunny/Downloads/Dawaighor website/src/app/pages/Login.tsx';
let loginContent = fs.readFileSync(loginFile, 'utf8');

// The Demo Access block
const demoBlockRegex = /\{\/\* Admin hint \*\/\}[\s\S]*?\{\/\* Error \*\/\}/;
loginContent = loginContent.replace(demoBlockRegex, '{/* Error */}');
fs.writeFileSync(loginFile, loginContent, 'utf8');
console.log('Removed demo block from Login.tsx');
