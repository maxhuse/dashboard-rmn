const co = require('co');
const PollingInterface = require('./polling-interface');
const fetchToday = require('../../routes/today/fetch-today');

class Today extends PollingInterface {
  constructor() {
    if (Today.instance) {
      return Today.instance;
    }

    super();

    Today.instance = this;
  }

  // eslint-disable-next-line class-methods-use-this
  get id() {
    return 'update:today';
  }

  // eslint-disable-next-line class-methods-use-this
  get interval() {
    return 5000;
  }

  next() {
    const event = this.id;

    return co(function* generator() {
      const payload = yield fetchToday();

      return { event, payload };
    }).catch(this.errorHandler.bind(this));
  }
}

module.exports = Today;
