const fs = require('fs');
const path = require('path');
const readline = require('readline');
const config = require('../config.json');

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
  return (await listDirEntries(dirPath)).filter(o => o.type === 'dir');
}

async function listDirEntries(dirPath) {
  dirPath = dirPath || '';
  const rootPath = path.resolve(getNotesPath(), dirPath);
  const dirents = await fs.promises.readdir(rootPath, { withFileTypes: true });
  const dirs = await Promise.all(dirents.map(async (dirent) => {
    const relativePath = (dirPath === '') ? dirent.name : [dirPath, dirent.name].join('/');
    const stats = fs.statSync(path.resolve(rootPath, dirent.name))
    const ext = path.extname(path.resolve(rootPath, dirent.name));
    const type = stats.isDirectory() ? 'dir' : ext.replace('.', '');
    const data = type === 'dir' ? null : await getItemData(path.resolve(rootPath, dirent.name))
    return { 
      path: relativePath,
      name: dirent.name, 
      type,
      stats,
      data
    }
  }));
  return dirs;
}

async function getItemData(itemPath) {
  switch (path.extname(itemPath)) {
    case '.json':
      const data = await fs.promises.readFile(itemPath)
        .then((data) => JSON.parse(data))
        .catch((error) => null);
      return data;
    case '.md':
      const fileStream = fs.createReadStream(itemPath);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      });
      let jsonText = '';
      let readLine = false;
      for await (const line of rl) {
        if(line.includes('<!---')) {
          readLine = true;
          continue;
        }
        if(line.includes('--->')) {
          break;
        }
        if(readLine) {
          jsonText += line;
        }
      }
      let mdData = null;
      try {
        mdData = JSON.parse(jsonText);
      } catch (error) {
        // Domain error ?
      }
      return mdData;
    default:
      return null;
  }
}

function getNotesPath() {
  return path.resolve(config.dataPath, 'notes');
}

function getUsersPath() {
  return path.resolve(config.dataPath, 'users');
}