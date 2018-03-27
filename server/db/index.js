const Sequelize = require('sequelize');
const config = require('../config');
const models = require('./models');

const sequelize = new Sequelize(config.sequelize);

const db = {
  sequelize,
  Sequelize,
};

// Define all models
Object.keys(models).forEach((key) => {
  db[key] = models[key](sequelize);
});

// DB functions
db.getAllOrders = () => db.orders.findAll({
  attributes: ['id', 'date', 'status', 'value'],
  order: [
    ['date', 'DESC']
  ],
  limit: 10,
  include: [
    { model: db.products, attributes: ['name'], required: false },
    { model: db.visitors, attributes: ['id'], required: false }
  ],
});

module.exports = db;
