const { httpCodes } = require('../../constants');
const db = require('../../db');
const co = require('co');

const getOrders = (req, res, next) => co(function* gen() {
  const orders = yield db.getAllOrders();

  return res.status(httpCodes.OK).send(orders);
}).catch(error => next(error));

module.exports = getOrders;
