const path = require('path');

module.exports = {
  PORT: 3000,
  DB_PATH: path.join(__dirname, '../database/db.sqlite'),
  SESSION_SECRET: 'tempSecretKey'
};
