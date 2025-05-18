// generate-files-json.js
const fs = require('fs');
const path = require('path');

function walk(dirPath) {
  const list = fs.readdirSync(dirPath).map(name => {
    const fullPath = path.join(dirPath, name);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      return {
        name,
        type: "folder",
        children: walk(fullPath)
      };
    } else {
      return {
        name,
        type: "file"
      };
    }
  });
  return list;
}

const structure = walk('./files');
fs.writeFileSync('./assets/files.json', JSON.stringify(structure, null, 2));
console.log("✅ 文件结构生成成功");