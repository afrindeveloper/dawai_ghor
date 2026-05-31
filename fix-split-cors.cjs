const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, regex, replacement) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(regex, replacement);
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
}

// Fix split errors
replaceInFile('/Users/mdsunny/Downloads/Dawaighor website/src/app/components/Header.tsx', /user\.name\.split/g, "user?.name?.split");
replaceInFile('/Users/mdsunny/Downloads/Dawaighor website/src/app/components/MobileNav.tsx', /user\.name\.split/g, "user?.name?.split");

// Fix server CORS
const serverJs = '/Users/mdsunny/Downloads/Dawaighor website/server/server.js';
let serverContent = fs.readFileSync(serverJs, 'utf8');

// Replace dynamic origin with explicit array
const oldCorsRegex = /app\.use\(cors\(\{[\s\S]*?credentials:\s*true\s*\}\)\);/;
const newCors = `app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:5173', 'https://dawai-ghor.vercel.app'].filter(Boolean),
  credentials: true
}));`;

serverContent = serverContent.replace(oldCorsRegex, newCors);
fs.writeFileSync(serverJs, serverContent, 'utf8');
console.log("Updated server.js CORS with explicit domains");
