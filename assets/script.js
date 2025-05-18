// 模拟文件结构（你也可以用递归自动读取）
const files = [
  { name: "example.pdf", type: "file" },
  { name: "photo.jpg", type: "file" },
  { name: "archive.zip", type: "file" }
];

const tree = document.createElement("ul");
tree.classList.add("tree");

files.forEach(file => {
  const li = document.createElement("li");
  const icon = file.type === "file" ? "📄" : "📁"; // 可替换为 SVG 图标
  li.innerHTML = `<span class="file-icon">${icon}</span><a href="files/${file.name}" download>${file.name}</a>`;
  tree.appendChild(li);
});

document.getElementById("file-tree").appendChild(tree);
