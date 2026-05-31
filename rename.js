import fs from 'fs';
import path from 'path';

const SRC_DIR = '/Users/mdsunny/Downloads/Dawaighor website/src';

// First rename the file
fs.renameSync(
  path.join(SRC_DIR, 'app/utils/localStorage.ts'),
  path.join(SRC_DIR, 'app/utils/api.ts')
);

// Then walk and update imports
function walkSync(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walkSync(filepath, callback);
    } else {
      callback(filepath);
    }
  }
}

walkSync(SRC_DIR, (filepath) => {
  if (!filepath.endsWith('.tsx') && !filepath.endsWith('.ts')) return;
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;

  content = content.replace(/utils\/localStorage/g, 'utils/api');

  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Updated import in ${filepath}`);
  }
});
