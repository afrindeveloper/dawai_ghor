const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, regex, replacement) {
  const content = fs.readFileSync(filePath, 'utf8');
  const newContent = content.replace(regex, replacement);
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath, /user\.name\.charAt/g, "user?.name?.charAt");
      replaceInFile(fullPath, /profile\.name\.charAt/g, "profile?.name?.charAt");
      replaceInFile(fullPath, /msg\.name\.charAt/g, "msg?.name?.charAt");
      replaceInFile(fullPath, /selected\.name\.charAt/g, "selected?.name?.charAt");
    }
  });
}

walkDir(path.join(__dirname, 'src/app'));

// Fix CORS in server.js
const serverJs = path.join(__dirname, 'server/server.js');
let serverContent = fs.readFileSync(serverJs, 'utf8');
const corsRegex = /app\.use\(cors\(\{[\s\S]*?credentials:\s*true\s*\}\)\);/;
const newCors = `app.use(cors({
  origin: function (origin, callback) {
    callback(null, origin || true);
  },
  credentials: true
}));`;

serverContent = serverContent.replace(corsRegex, newCors);
fs.writeFileSync(serverJs, serverContent, 'utf8');
console.log("Updated server.js CORS");
