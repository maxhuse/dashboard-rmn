const { httpCodes } = require('../../constants');
const co = require('co');
const fetchToday = require('./fetch-today');

const getToday = (req, res, next) => co(function* gen() {
  const result = yield fetchToday();

  return res.status(httpCodes.OK).send(result);
}).catch(error => next(error));

module.exports = getToday;
