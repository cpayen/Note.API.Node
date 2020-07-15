class NoteItem {

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
}

class NoteItemDir extends NoteItem {

  constructor(name, path, createdAt, updatedAt) {
    super(name, path, createdAt, updatedAt);
    this.type = 'dir';
  }

  type;
}

class NoteItemFile extends NoteItem {
  
  constructor(name, path, createdAt, updatedAt) {
    super(name, path, createdAt, updatedAt);
    this.type = 'file';
  }

  type;
}

class NoteItemLink extends NoteItem {
  
  constructor(name, path, createdAt, updatedAt) {
    super(name, path, createdAt, updatedAt);
    this.type = 'link';
  }

  type;
}

class NoteItemPage extends NoteItem {
  
  constructor(name, path, createdAt, updatedAt) {
    super(name, path, createdAt, updatedAt);
    this.type = 'page';
  }

  type;
}

class NoteItemTodo extends NoteItem {
  
  constructor(name, path, createdAt, updatedAt) {
    super(name, path, createdAt, updatedAt);
    this.type = 'todo';
  }

  type;
}

module.exports = {
  NoteItemDir,
  NoteItemPage,
  NoteItemTodo,
  NoteItemLink,
  NoteItemFile
};