const fs = require('fs');
const path = require('path');
const config = require('config.json');

module.exports = {
  getTree
};

async function getTree() {
  const { dataPath } = config;
  return await walkDirs(path.resolve(dataPath, 'notes'));
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
