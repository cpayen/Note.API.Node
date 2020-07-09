const fs = require('fs');
const path = require('path');
const db = require('../../helpers/db');
const { NoteDir } = require('./notes.classes');

module.exports = {
  getTree,
  getDir
};

async function getTree() {
  return await walkDirs();
}

async function getDir(rootDir) {
  return await listAll(path.resolve(db.getDataPath(), rootDir));
}

async function walkDirs(rootDir) {
  rootDir = rootDir || '';
  const rootPath = path.resolve(db.getDataPath(), rootDir);
  const dirents = await fs.promises.readdir(rootPath, { withFileTypes: true });
  const dirs = await Promise.all(dirents.filter(o => o.isDirectory()).map((dirent) => {
    const relativePath = (rootDir === '') ? dirent.name : [rootDir, dirent.name].join('/');
    const stats = fs.statSync(path.resolve(rootPath, dirent.name));
    return new NoteDir(dirent.name, relativePath, stats.ctime, stats.mtime);
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
