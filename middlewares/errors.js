const logger = require('../helpers/logger');

module.exports = errorHandler;

function errorHandler(err, req, res, next) {

  // custom application error
  if (typeof (err) === 'string') {
    logger.info(err);
    return res.status(400).json({ message: err });
  }

  // jwt authentication error
  if (err.name === 'UnauthorizedError') {
    logger.error(err);
    return res.status(401).json({ message: 'Invalid Token' });
  }

  // resource not fond error
  if (err.name === 'ResourceNotFoundError') {
    logger.error(err);
    return res.status(404).json({ message: 'Resource not found' });
  }

  // default to 500 server error
  logger.error(err);
  return res.status(500).json({ message: 'An error occurred' });
}