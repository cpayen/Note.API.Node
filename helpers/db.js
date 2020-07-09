// const fs = require('fs');
const path = require('path');
const config = require('config.json');

module.exports = {
  getDataPath,
  getUsersPath
};

function getDataPath() {
  return path.resolve(config.dataPath, 'notes');
}

function getUsersPath() {
  return path.resolve(config.dataPath, 'users');
}