const Sequelize = require('sequelize');
const config = require('../server/config');
const models = require('../server/sequelize/models');

const sequelize = new Sequelize(config.sequelize);

// Define models that represents tables
Object.keys(models).forEach(key => models[key](sequelize));

// Trigger sync that create the tables
sequelize.sync().then(() => {
  console.log('Tables created');
  sequelize.close();
});
