const db = require('../../db');
const co = require('co');
const moment = require('moment');

const fetchToday = () => co(function* fetchGen() {
  const from = moment().startOf('day').unix();
  const to = moment().endOf('day').unix();

  // Get information for the current day
  const { newOrdersModel, closedOrdersModel, visitsModel } = yield {
    newOrdersModel: db.getTodayOrders({ from, to }),
    closedOrdersModel: db.getTodayClosedOrders({ from, to }),
    visitsModel: db.getTodayVisits({ from, to }),
  };

  return {
    newOrders: newOrdersModel.get('count'),
    closedOrders: closedOrdersModel.get('count'),
    revenue: closedOrdersModel.get('revenue'),
    visits: visitsModel.get('count'),
  };
});

module.exports = fetchToday;
