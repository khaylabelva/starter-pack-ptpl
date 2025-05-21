const bcrypt = require('bcrypt');

const users = [
  {
    email: 'demo@minimals.cc',
    password: bcrypt.hashSync('@demo1', 10)
  }
];

module.exports = { users };
