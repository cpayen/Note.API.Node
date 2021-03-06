const fs = require('fs');
const path = require('path');
const readline = require('readline');
const config = require('../config/config');
const { DbEntry } = require('./db.classes');

module.exports = {
  authUser,
  listDirs,
  listEntries,
  getEntry,
  checkAccess,
};

async function authUser(username, password) {
  const userFilePath = path.resolve(getUsersPath(), `${username}.json`);
  
  const userFileExists = await fs.promises.access(userFilePath)
    .then(() => true)
    .catch(() => false);
  
  if(!userFileExists) {
    return false;
  }

  let user = false;
  await fs.promises.readFile(userFilePath) 
    .then((result) => { 
      const jsonUser = JSON.parse(result);
      if(jsonUser.password === password) {
        user = jsonUser;
      }
    }) 
    .catch();
  
  return user;
}

async function listDirs(dirPath) {
  return await listFilteredEntries(dirPath, o => o.isDirectory());
}

async function listEntries(dirPath) {
  return await listFilteredEntries(dirPath);
}

async function listFilteredEntries(dirPath, filter) {
  dirPath = dirPath || '';
  filter = filter || ((o) => true);

  const rootPath = path.resolve(getNotesPath(), dirPath);
  const dirents = await fs.promises.readdir(rootPath, { withFileTypes: true });
  const entries = await Promise.all(dirents.filter(filter).map(async (dirent) => {
    const relativePath = dirPath === '' ? dirent.name : [dirPath, dirent.name].join('/');
    const stats = fs.statSync(path.resolve(rootPath, dirent.name))
    const data = stats.isDirectory() ? null : await getItemData(path.resolve(rootPath, dirent.name));
    return new DbEntry(relativePath, dirent.name, stats.birthtime, stats.mtime, stats.isDirectory(), data);
  }));

  return entries;
}

async function getEntry(itemPath) {
  const rootPath = path.resolve(getNotesPath(), itemPath);
  const file = await fs.promises.readFile(rootPath, 'utf8');
  const stats = fs.statSync(rootPath)
  const data = await getMarkdownItemData(rootPath);
  let entry = new DbEntry(itemPath, file.name, stats.birthtime, stats.mtime, stats.isDirectory(), data);
  entry.content = file;
  return entry;
}

async function checkAccess(itemPath) {
  const rootPath = path.resolve(getNotesPath(), itemPath || '');
  return await fs.promises.access(rootPath)
    .then(() => true)
    .catch(() => false);
}

function getNotesPath() {
  return path.resolve(config.dataPath, 'notes');
}

function getUsersPath() {
  return path.resolve(config.dataPath, 'users');
}

async function getItemData(itemPath) {
  switch (path.extname(itemPath)) {
    case '.json':
      return await getJsonItemData(itemPath);
    case '.md':
      return await getMarkdownItemData(itemPath);
    default:
      return null;
  }
}

async function getJsonItemData(itemPath) {
  return await fs.promises.readFile(itemPath)
    .then((data) => JSON.parse(data))
    .catch((error) => null);
}

async function getMarkdownItemData(itemPath) {
  const fileStream = fs.createReadStream(itemPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let jsonText = '';
  let firstLine = true;
  for await (const line of rl) {
    if(firstLine) {
      firstLine = false;
      if (!line.includes('<!---')) {
        break;
      }
      continue;
    }
    if (line.includes('--->')) {
      break;
    }
    jsonText += line;
  }

  let data = null;
  try {
    data = JSON.parse(jsonText);
  } catch (error) {}
  return data;
}
