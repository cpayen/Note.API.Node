const { BadFileFormatError } = require("../../errors/errors.classes");

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

  validate = function(data) {
    for (var i = 1; i < arguments.length; i++) {
      if(!data[arguments[i]]) {
        throw new BadFileFormatError(this.path);
      }
    }

    // for (const prop of props) {
    //   if(!data[prop]) {
    //     throw new BadFileFormatError(this.path);
    //   }
    // }
  }
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
    this.validate(data, 'title', 'url');

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
    this.validate(data, 'title');

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
    this.validate(data, 'title');

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