const { httpCodes } = require('../../constants');
const db = require('../../db');
const co = require('co');
const moment = require('moment');

const getToday = (req, res, next) => co(function* gen() {
  const from = moment().startOf('day').unix();
  const to = moment().endOf('day').unix();

  // Get information for the current day
  const { newOrdersModel, closedOrdersModel, visitsModel } = yield {
    newOrdersModel: db.getTodayNewOrders({ from, to }),
    closedOrdersModel: db.getTodayClosedOrders({ from, to }),
    visitsModel: db.getTodayVisits({ from, to }),
  };

  const result = {
    newOrders: newOrdersModel.get('count'),
    closedOrders: closedOrdersModel.get('count'),
    revenue: closedOrdersModel.get('revenue'),
    visits: visitsModel.get('count'),
  };

  return res.status(httpCodes.OK).send(result);
}).catch(error => next(error));

module.exports = getToday;
