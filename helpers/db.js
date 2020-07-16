const fs = require('fs');
const path = require('path');
const readline = require('readline');
const config = require('../config.json');
const { DbEntry } = require('./db.classes');

module.exports = {
  authUser,
  listDirs,
  listDirEntries
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
  return (await listDirEntries(dirPath)).filter(o => o.isDirectory);
}

async function listDirEntries(dirPath) {
  dirPath = dirPath || '';
  const rootPath = path.resolve(getNotesPath(), dirPath);
  const dirents = await fs.promises.readdir(rootPath, { withFileTypes: true });
  const entries = await Promise.all(dirents.map(async (dirent) => {
    const relativePath = dirPath === '' ? dirent.name : [dirPath, dirent.name].join('/');
    const stats = fs.statSync(path.resolve(rootPath, dirent.name))
    const data = stats.isDirectory() ? null : await getItemData(path.resolve(rootPath, dirent.name));
    return new DbEntry(relativePath, dirent.name, stats.ctime, stats.mtime, stats.isDirectory(), data);
  }));
  return entries;
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
  let readLine = false;
  for await (const line of rl) {
    if (line.includes('<!---')) {
      readLine = true;
      continue;
    }
    if (line.includes('--->')) {
      break;
    }
    if (readLine) {
      jsonText += line;
    }
  }

  let data = null;
  try {
    data = JSON.parse(jsonText);
  } catch (error) {
    // Domain error ?
  }
  return data;
}
