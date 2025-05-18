// 获取文件扩展名（不区分大小写）
function getExtensionIcon(filename) {
  const match = filename.match(/\.([^.]+)$/);
  if (match) {
    const ext = match[1].toLowerCase();
    return `assets/icons/${ext}.png`;
  }
  return `assets/icons/default.png`;
}

function createTree(items, basePath = 'files/') {
  const ul = document.createElement('ul');

  for (const item of items) {
    const li = document.createElement('li');

    if (item.type === 'folder') {
      const icon = document.createElement('img');
      icon.src = 'assets/icons/folder.png';
      icon.className = 'icon';

      li.appendChild(icon);
      li.append(' ' + item.name);
      li.appendChild(createTree(item.children, basePath + item.name + '/'));
    } else {
      const icon = document.createElement('img');
      icon.src = getExtensionIcon(item.name);
      icon.className = 'icon';

      const link = document.createElement('a');
      link.href = basePath + item.name;
      link.textContent = ' ' + item.name;
      link.setAttribute('download', ''); // 直接下载

      li.appendChild(icon);
      li.appendChild(link);
    }

    ul.appendChild(li);
  }

  return ul;
}

fetch('assets/files.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('file-tree');
    container.appendChild(createTree(data));
  });
