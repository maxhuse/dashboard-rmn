const { httpCodes } = require('../../constants');
const sequelize = require('../../sequelize');
const co = require('co');

const getOrders = (req, res, next) => co(function* gen() {
  const orders = yield sequelize.getOrders();

  return res.status(httpCodes.OK).send(orders);
}).catch(error => next(error));

module.exports = getOrders;
