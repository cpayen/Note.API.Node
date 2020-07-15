const db = require('../../helpers/db');
const { NoteItemDir, NoteItemFile, NoteItemLink, NoteItemPage, NoteItemTodo } = require('./notes.classes');

module.exports = {
  getTree,
  getEntries
};

async function getTree() {
  return await walkDirs();
}

async function getEntries(rootDir) {
  return await listAll(rootDir);
}

async function walkDirs(rootDir) {
  const dirs = (await db.listDirs(rootDir)).map((dirent) => {
    return new NoteItemDir(
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
  const items = (await db.listDirEntries(rootDir)).map((dirent) => {
    let itemType = dirent.type;
    if(dirent.data !== null) {
      itemType = dirent.data.type;
    }
    switch (itemType) {
      case 'dir':
        return new NoteItemDir(
          dirent.name, 
          dirent.path, 
          dirent.stats.ctime, 
          dirent.stats.mtime);
      case 'link':
        return new NoteItemLink(
          dirent.name, 
          dirent.path, 
          dirent.stats.ctime, 
          dirent.stats.mtime);
      case 'page':
        return new NoteItemPage(
          dirent.name, 
          dirent.path, 
          dirent.stats.ctime, 
          dirent.stats.mtime);
      case 'todo':
        return new NoteItemTodo(
          dirent.name, 
          dirent.path, 
          dirent.stats.ctime, 
          dirent.stats.mtime);
      default:
        return new NoteItemFile(
          dirent.name, 
          dirent.path, 
          dirent.stats.ctime, 
          dirent.stats.mtime);
    }
  });

  return items;
}
