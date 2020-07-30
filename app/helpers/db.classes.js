class DbEntry {
  
  constructor(path, name, ctime, mtime, isDirectory, data) {
    this.path = path;
    this.name = name;
    this.ctime = ctime;
    this.mtime = mtime;
    this.type = isDirectory ? 'dir' : 'file';
    
    if(data) {
      for (const [key, value] of Object.entries(data)) {
        this[key] = value;
      }
    }
  }
}

module.exports = {
  DbEntry
};