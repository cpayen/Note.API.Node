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
  }
}

module.exports = {
  ResourceNotFoundError,
};