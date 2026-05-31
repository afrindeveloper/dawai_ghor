const fs = require('fs');
const file = '/Users/mdsunny/Downloads/Dawaighor website/server/server.js';
let content = fs.readFileSync(file, 'utf8');

const opts = `const cookieOptions = {
  httpOnly: true,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: process.env.NODE_ENV === 'production'
};
`;

if (!content.includes('cookieOptions')) {
  content = content.replace('const PORT = process.env.PORT || 5001;\n', 'const PORT = process.env.PORT || 5001;\n\n' + opts);
  content = content.replace(/\{ httpOnly: true, maxAge: 30 \* 24 \* 60 \* 60 \* 1000 \}/g, 'cookieOptions');
  fs.writeFileSync(file, content, 'utf8');
}
