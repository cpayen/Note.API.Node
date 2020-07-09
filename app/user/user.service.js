const config = require('config.json');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const db = require('../../helpers/db');

module.exports = {
  authenticate
};

async function authenticate({ username, password }) {
  const user = await findUser(username, password);
  if (!user) throw 'Username or password is incorrect';

  const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d', algorithm: 'HS256' });

  return {
    ...omitPassword(user),
    token
  };
}

// helper functions

async function findUser(username, password) {
  const userFilePath = path.resolve(db.getUsersPath(), `${username}.json`);
  let user = false;

  await fs.promises.readFile(userFilePath) 
    .then((result) => { 
      const jsonUser = JSON.parse(result);
      if(jsonUser.password === password) {
        user = jsonUser;
      }
    }) 
    .catch();
  
  return user;
}

function omitPassword(user) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}