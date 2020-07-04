const fs = require('fs');
const path = require('path');
const config = require('config.json');

module.exports = {
  getTree,
  getDir
};

async function getTree() {
  const { dataPath } = config;
  return await walkDirs(path.resolve(dataPath, 'notes'));
}

async function getDir(rootDir) {
  const { dataPath } = config;
  return await listAll(path.resolve(dataPath, 'notes', rootDir));
}

async function walkDirs(rootDir) {
  const dirents = await fs.promises.readdir(rootDir, { withFileTypes: true });
  const dirs = await Promise.all(dirents.map((dirent) => {
    const res = path.resolve(rootDir, dirent.name);
    if(dirent.isDirectory()) {
      return { path: res, name: dirent.name };
    }
  }));
  for (const dir of dirs) {
    dir.children = await walkDirs(dir.path);
  }
  return dirs;
}

async function listAll(rootDir) {
  const dirents = await fs.promises.readdir(rootDir, { withFileTypes: true });
  const items = await Promise.all(dirents.map((dirent) => {
    const itemPath = path.resolve(rootDir, dirent.name);
    const stats = fs.statSync(itemPath);
    // const ext = path.extname(itemPath);
    return { path: itemPath, name: dirent.name, stats };
  }));
  return items;
}
