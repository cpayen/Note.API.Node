const config = require('../../config/config');
const jwt = require('jsonwebtoken');
const db = require('../../helpers/db');

module.exports = {
  authenticate
};

async function authenticate({ username, password }) {
  const user = await db.authUser(username, password);
  if (!user) throw 'Username or password is incorrect';

  const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d', algorithm: 'HS256' });

  return {
    ...omitPassword(user),
    token
  };
}

function omitPassword(user) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}