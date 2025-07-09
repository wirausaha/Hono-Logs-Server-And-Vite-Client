import fs from 'fs';
import path from 'path';

const dir = './dist';

function walk(dirPath) {
  for (const file of fs.readdirSync(dirPath)) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) walk(fullPath);
    else if (file.endsWith('.js')) {
      let code = fs.readFileSync(fullPath, 'utf8');
      code = code.replace(
        /from\s+['"]((?:\.{1,2}\/).*?)(?<!\.js)['"]/g,
        (_, p1) => `from '${p1}.js'`
      );
      fs.writeFileSync(fullPath, code);
    }
  }
}

walk(dir);
