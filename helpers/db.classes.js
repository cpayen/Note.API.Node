class DbEntry {
  
  constructor(path, name, ctime, mtime, isDirectory, data) {
    this.path = path;
    this.name = name;
    this.ctime = ctime;
    this.mtime = mtime;
    this.isDirectory = isDirectory;
    this.data = data;
  }

  path;
  name;
  ctime;
  mtime;
  isDirectory;
  data;
  content;
}

module.exports = {
  DbEntry
};