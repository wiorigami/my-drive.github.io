const fs = require('fs');
const path = require('path');

const basePath = 'files';

function walk(dir) {
  const items = fs.readdirSync(dir);
  return items.map(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      return {
        type: 'folder',
        name: item,
        children: walk(fullPath)
      };
    } else {
      return {
        type: 'file',
        name: item
      };
    }
  });
}

const tree = walk(basePath);
fs.writeFileSync('assets/files.json', JSON.stringify(tree, null, 2));
console.log('✅ files.json updated');
