const path = require('path');

module.exports = {
  logsDir: './logs',
  sequelize: {
    dialect: 'sqlite',
    pool: {
      max: 5,
      idle: 30000,
      acquire: 60000,
    },
    storage: path.resolve(__dirname, '../sql/_dashboard.sqlite'),
    logging: false,
  },
};
