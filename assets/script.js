function createTree(data, path = 'files') {
  const ul = document.createElement('ul');
  ul.classList.add('tree');

  data.forEach(item => {
    const li = document.createElement('li');

    if (item.type === 'folder') {
      li.classList.add('folder');

      const toggle = document.createElement('span');
      toggle.classList.add('toggle');
      toggle.textContent = '▶';

      const icon = document.createElement('img');
      icon.src = 'assets/icons/folder.png';
      icon.style.width = '16px';
      icon.style.verticalAlign = 'middle';
      icon.style.marginRight = '4px';

      const name = document.createElement('span');
      name.textContent = item.name;
      name.classList.add('name');

      const children = createTree(item.children, path + '/' + item.name);
      children.classList.add('children', 'hidden');

      toggle.onclick = () => {
        const expanded = toggle.textContent === '▼';
        toggle.textContent = expanded ? '▶' : '▼';
        children.classList.toggle('hidden');
      };

      li.appendChild(toggle);
      li.appendChild(icon);
      li.appendChild(name);
      li.appendChild(children);

    } else if (item.type === 'file') {
      const icon = document.createElement('img');
      icon.src = getIconForFile(item.name); // 你可能已有此函数
      icon.style.width = '16px';
      icon.style.verticalAlign = 'middle';
      icon.style.marginRight = '4px';

      const link = document.createElement('a');
      link.href = path + '/' + item.name;
      link.textContent = item.name;
      link.setAttribute('download', '');

      li.appendChild(icon);
      li.appendChild(link);
    }

    ul.appendChild(li);
  });

  return ul;
}
function getIconForFile(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  return 'assets/icons/' + (ext + '.png');
}
