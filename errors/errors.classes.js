class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ResourceNotFoundError extends DomainError {
  constructor(path) {
    super(`Resource "${path}" was not found.`);
    this.data = { path };
  }
}

class BadFileFormatError extends DomainError {
  constructor(file, error) {
    super(`File "${file}" is not well formatted.`);
    this.data = { file, error };
  }
}

module.exports = {
  ResourceNotFoundError,
  BadFileFormatError,
};