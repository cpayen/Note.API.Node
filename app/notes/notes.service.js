const db = require('../../helpers/db');
const { ResourceNotFoundError } = require('../../errors/errors.classes');

module.exports = {
  getTree,
  getEntries,
  getEntry
};

async function getTree() {
  return await walkDirs();
}

async function getEntries(rootDir) {
  if(await db.checkAccess(rootDir) === false) throw new ResourceNotFoundError(rootDir);
  return await db.listEntries(rootDir);
}

async function getEntry(entryPath) {
  if(await db.checkAccess(entryPath) === false) throw new ResourceNotFoundError(entryPath);
  return await db.getEntry(entryPath);
}

async function walkDirs(rootDir) {
  const dirs = await db.listDirs(rootDir);
  for (const dir of dirs) {
    dir.children = await walkDirs(dir.path);
  }
  return dirs;
}
