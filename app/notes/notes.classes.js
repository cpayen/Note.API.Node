
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

  constructor(name, path, type, createdAt, updatedAt) {
    this.name = name;
    this.path = path;
    this.type = type;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  name;
  path;
  type;
  createdAt;
  updatedAt;
}

module.exports = {
  NoteDir,
  NoteItem
};