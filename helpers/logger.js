var winston = require('winston');
const { format } = require('logform');

const fileFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.printf(info => getMessage(info))
);

const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.errors({ stack: true }),
  format.printf(info => getMessage(info))
);

const getMessage = (info) => {
  let message = `${info.timestamp} ${info.level}: ${info.message}`;
  if(info.stack) {
    message += `\n    stack: ${info.stack}`;
  }
  return message;
}

const logger = winston.createLogger({
  level: 'info',
  format: fileFormat,
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
  }));
}

module.exports = logger;