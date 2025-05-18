fetch('assets/files.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('file-tree');

    function createTree(items, basePath = 'files/') {
      const ul = document.createElement('ul');
      for (const item of items) {
        const li = document.createElement('li');
        if (item.type === 'folder') {
          li.innerHTML = `<span class="folder-icon">📁</span> ${item.name}`;
          li.appendChild(createTree(item.children, basePath + item.name + '/'));
        } else {
          const link = document.createElement('a');
          link.href = basePath + item.name;
          link.textContent = item.name;
          link.target = "_blank";
          li.appendChild(link);
        }
        ul.appendChild(li);
      }
      return ul;
    }

    container.appendChild(createTree(data));
  });
