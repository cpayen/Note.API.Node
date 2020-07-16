module.exports = errorHandler;

function errorHandler(err, req, res, next) {

  // debug
  console.error(err);

  // custom application error
  if (typeof (err) === 'string') {
    return res.status(400).json({ message: err });
  }

  // jwt authentication error
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Invalid Token' });
  }

  // resource not fond error
  if (err.name === 'ResourceNotFoundError') {
    return res.status(404).json({ message: 'Resource not found' });
  }

  // default to 500 server error
  return res.status(500).json({ message: 'An error occurred' });
}