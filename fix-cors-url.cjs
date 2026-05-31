const fs = require('fs');
const serverJs = '/Users/mdsunny/Downloads/Dawaighor website/server/server.js';
let content = fs.readFileSync(serverJs, 'utf8');

const regex = /origin: \[process\.env\.FRONTEND_URL, 'http:\/\/localhost:5173', 'https:\/\/dawai-ghor\.vercel\.app'\]\.filter\(Boolean\),/;
const newOrigin = `origin: [process.env.FRONTEND_URL, 'http://localhost:5173', 'https://dawai-ghor.vercel.app', 'https://dawaighor.vercel.app'].filter(Boolean),`;

content = content.replace(regex, newOrigin);
fs.writeFileSync(serverJs, content, 'utf8');
