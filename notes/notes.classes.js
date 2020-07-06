
class NoteDir {

  constructor(name, path, createdAt, updatedAt) {
    this.name = name;
    this.path = path;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  name;
  path;
  createdAt;
  updatedAt;
  children;
}

class NoteItem {
  
}

module.exports = {
  NoteDir,
  NoteItem
};