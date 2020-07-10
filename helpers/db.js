const fs = require('fs');
const path = require('path');
const config = require('../config.json');

module.exports = {
  listDirs,
  listDirContent
};

async function listDirs(dirPath) {
  return (await listDirContent(dirPath)).filter(o => o.type === 'dir');
}

async function listDirContent(dirPath) {
  dirPath = dirPath || '';
  const rootPath = path.resolve(getNotesPath(), dirPath);
  const dirents = await fs.promises.readdir(rootPath, { withFileTypes: true });
  const dirs = await Promise.all(dirents.map((dirent) => {
    const relativePath = (dirPath === '') ? dirent.name : [dirPath, dirent.name].join('/');
    const stats = fs.statSync(path.resolve(rootPath, dirent.name))
    const ext = path.extname(path.resolve(rootPath, dirent.name));
    const type = ext === '' ? 'dir' : ext.replace('.', '');
    //const name = ...
    //const description = ...
    return { 
      path: relativePath,
      name: dirent.name, 
      type,
      stats
    }
  }));
  return dirs;
}

function getNotesPath() {
  return path.resolve(config.dataPath, 'notes');
}