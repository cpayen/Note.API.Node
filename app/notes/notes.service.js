const db = require('../../helpers/db');
const { NoteItemDir, NoteItemFile, NoteItemLink, NoteItemPage, NoteItemTodo } = require('./notes.classes');
const { ResourceNotFoundError } = require('../../errors/errors.classes');
const logger = require('../../helpers/logger');

module.exports = {
  getTree,
  getEntries
};

async function getTree() {
  return await walkDirs();
}

async function getEntries(rootDir) {
  if(await db.checkAccess(rootDir) === false) throw new ResourceNotFoundError(rootDir);
  return await listAll(rootDir);
}

async function walkDirs(rootDir) {
  const dirs = (await db.listDirs(rootDir)).map((entry) => {
    return new NoteItemDir(
      entry.name, 
      entry.path, 
      entry.ctime, 
      entry.mtime);
  });

  for (const dir of dirs) {
    dir.children = await walkDirs(dir.path);
  }

  return dirs;
}

async function listAll(rootDir) {
  const items = (await db.listDirEntries(rootDir)).map((entry) => {
    let itemType = entry.isDirectory ? 'dir' : 'file';
    if(entry.data && entry.data.type) {
      itemType = entry.data.type;
    }
    
    const commonParams = [entry.name, entry.path, entry.ctime, entry.mtime]
    try {
      switch (itemType) {
        case 'dir':
          return new NoteItemDir(...commonParams);
        case 'link':
          return new NoteItemLink(...commonParams, entry.data);
        case 'page':
          return new NoteItemPage(...commonParams, entry.data);
        case 'todo':
          return new NoteItemTodo(...commonParams, entry.data);
        default:
          return new NoteItemFile(...commonParams);
      }
    } catch (error) {
      logger.error(error);
      return null;
    }
  });

  return items.filter(o => o !== null);
}

