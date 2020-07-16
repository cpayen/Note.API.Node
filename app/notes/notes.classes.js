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
  
  constructor(name, path, createdAt, updatedAt, data) {
    super(name, path, createdAt, updatedAt);
    this.type = 'link';
    this.title = data.title;
    this.url = data.url;
    this.description = data.description;
  }

  type;
  title;
  url;
  description;
}

class NoteItemPage extends NoteItem {
  
  constructor(name, path, createdAt, updatedAt, data) {
    super(name, path, createdAt, updatedAt);
    this.type = 'page';
    this.title = data.title;
    this.description = data.description;
  }

  type;
  title;
  description;
}

class NoteItemTodo extends NoteItem {
  
  constructor(name, path, createdAt, updatedAt, data) {
    super(name, path, createdAt, updatedAt);
    this.type = 'todo';
    this.title = data.title;
    this.description = data.description;
  }

  type;
  title;
  description;
}

module.exports = {
  NoteItemDir,
  NoteItemPage,
  NoteItemTodo,
  NoteItemLink,
  NoteItemFile
};