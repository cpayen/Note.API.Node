const db = require('../../helpers/db');
const { NoteDir, NoteItem } = require('./notes.classes');

module.exports = {
  getTree,
  getDir
};

async function getTree() {
  return await walkDirs();
}

async function getDir(rootDir) {
  return await listAll(rootDir);
}

async function walkDirs(rootDir) {
  const dirs = (await db.listDirs(rootDir)).map((dirent) => {
    return new NoteDir(
      dirent.name, 
      dirent.path, 
      dirent.stats.ctime, 
      dirent.stats.mtime);
  });

  for (const dir of dirs) {
    dir.children = await walkDirs(dir.path);
  }

  return dirs;
}

async function listAll(rootDir) {
  const items = (await db.listDirContent(rootDir)).map((dirent) => {
    return new NoteItem(
      dirent.name, 
      dirent.path, 
      dirent.type, 
      dirent.stats.ctime, 
      dirent.stats.mtime);
  });

  return items;
}
