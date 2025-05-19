async function fetchFiles() {
  const res = await fetch('files.json');
  return await res.json();
}

function getIconForFile(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  return `assets/icons/${ext}.png`;
}

function createIcon(path, isFolder) {
  const icon = document.createElement('img');
  icon.src = isFolder ? 'assets/icons/folder.png' : getIconForFile(path);
  icon.onerror = () => {
    icon.src = 'assets/icons/file.png';
  };
  icon.style.width = '16px';
  icon.style.marginRight = '5px';
  icon.style.verticalAlign = 'middle';
  return icon;
}

function createTree(container, files, basePath = '') {
  const ul = document.createElement('ul');

  files.forEach(item => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    const icon = createIcon(item.name, item.type === 'folder');

    const triangle = document.createElement('span');
    triangle.textContent = item.type === 'folder' ? '▶' : '';
    triangle.style.cursor = 'pointer';
    triangle.style.marginRight = '5px';

    triangle.onclick = () => {
      if (triangle.textContent === '▶') {
        triangle.textContent = '▼';
        childContainer.style.display = 'block';
      } else {
        triangle.textContent = '▶';
        childContainer.style.display = 'none';
      }
    };

    span.textContent = item.name;
    span.style.cursor = 'pointer';

    if (item.type === 'folder') {
      span.onclick = () => downloadFolder(`${basePath}${item.name}/`);
    } else {
      span.onclick = () => window.open(`files/${basePath}${item.name}`, '_blank');
    }

    const childContainer = document.createElement('div');
    childContainer.style.display = 'none';
    if (item.type === 'folder' && item.children) {
      createTree(childContainer, item.children, `${basePath}${item.name}/`);
    }

    li.appendChild(triangle);
    li.appendChild(icon);
    li.appendChild(span);
    li.appendChild(childContainer);
    ul.appendChild(li);
  });

  container.appendChild(ul);
}

async function downloadFolder(folderPath) {
  const zip = new JSZip();
  await addFolderToZip(zip, folderPath);
  zip.generateAsync({ type: 'blob' }).then(function(content) {
    saveAs(content, folderPath.split('/').filter(Boolean).pop() + '.zip');
  });
}

async function addFolderToZip(zipObj, folderPath) {
  const response = await fetch('files.json');
  const structure = await response.json();
  const folderData = findFolderData(structure, folderPath);
  if (!folderData) return;

  const folderZip = zipObj.folder(folderPath.split('/').filter(Boolean).pop());

  async function recurse(current, base) {
    for (let item of current) {
      const fullPath = base + item.name;
      if (item.type === 'folder') {
        const childFolder = folderZip.folder(item.name);
        if (item.children) await recurse(item.children, fullPath + '/');
      } else {
        const fileUrl = `files/${folderPath}${item.name}`;
        const res = await fetch(fileUrl);
        const blob = await res.blob();
        folderZip.file(item.name, blob);
      }
    }
  }

  await recurse(folderData.children, '');
}

function findFolderData(tree, path) {
  const parts = path.split('/').filter(Boolean);
  let current = tree;
  for (let part of parts) {
    const next = current.find(item => item.name === part && item.type === 'folder');
    if (!next) return null;
    current = next.children;
  }
  return { children: current };
}

(async () => {
  const files = await fetchFiles();
  const container = document.getElementById('file-tree');
  createTree(container, files);
})();
