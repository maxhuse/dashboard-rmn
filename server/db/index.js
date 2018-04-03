const Sequelize = require('sequelize');
const config = require('../config');
const models = require('./models');
const { orderStatus } = require('../../shared/constants');

const { eq, gt, lte } = Sequelize.Op;

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
  attributes: ['id', 'creationDate', 'status', 'value'],
  order: [
    ['creationDate', 'DESC']
  ],
  limit: 10,
  include: [
    { model: db.products, attributes: ['name'], required: false },
    { model: db.visitors, attributes: ['id'], required: false }
  ],
});

db.getOrderById = (id) => db.orders.findById(id, {
  attributes: ['id', 'creationDate', 'status', 'value'],
  include: [
    { model: db.products, attributes: ['name'], required: false },
    { model: db.visitors, attributes: ['id'], required: false }
  ],
});

db.getTodayOrders = ({ from, to }) => db.orders.findOne({
  attributes: [
    [Sequelize.fn('count'), 'count']
  ],
  where: {
    creationDate: {
      [gt]: from,
      [lte]: to,
    },
  },
});

db.getTodayClosedOrders = ({ from, to }) => db.orders.findOne({
  attributes: [
    [Sequelize.fn('count'), 'count'],
    [Sequelize.fn('ifnull', Sequelize.fn('sum', sequelize.col('value')), 0), 'revenue']
  ],
  where: {
    status: {
      [eq]: orderStatus.CLOSED,
    },
    closingDate: {
      [gt]: from,
      [lte]: to,
    },
  },
});

db.getTodayVisits = ({ from, to }) => db.visits.findOne({
  attributes: [
    [Sequelize.fn('count'), 'count']
  ],
  where: {
    date: {
      [gt]: from,
      [lte]: to,
    },
  },
});

module.exports = db;
