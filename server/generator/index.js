const moment = require('moment');
const co = require('co');
const db = require('../db');
const logger = require('../logger');
const { orderStatus } = require('../../shared/constants');
const socket = require('../socket');

const { eq } = db.Sequelize.Op;

class Generator {
  constructor() {
    this.timers = {};
  }

  // eslint-disable-next-line class-methods-use-this
  errorHandler(error) {
    logger.log('warn', error);
  }

  addNewVisitor() {
    const self = this;

    co(function* gen() {
      const visitorModel = yield db.visitors.create();

      yield db.visits.create({
        visitorId: visitorModel.get('id'),
        date: moment().unix(),
      });
    }).catch(error => self.errorHandler(error));
  }

  // eslint-disable-next-line class-methods-use-this
  getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  addNewOrder() {
    const self = this;

    co(function* gen() {
      const products = yield db.products.findAll();
      const visitors = yield db.visitors.findAll();

      const visitorModel = visitors[self.getRandom(1, visitors.length)];
      const productModel = products[self.getRandom(1, products.length)];

      const newModel = yield db.orders.create({
        visitorId: visitorModel.get('id'),
        productId: productModel.get('id'),
        creationDate: moment().unix(),
        value: productModel.get('price'),
      });

      const order = yield db.getOrderById(newModel.get('id'));

      socket.broadcast({ event: 'add:order', payload: order });
    }).catch(error => self.errorHandler(error));
  }

  closeOrder() {
    const self = this;

    co(function* gen() {
      const orders = yield db.orders.findAll({
        where: {
          status: {
            [eq]: orderStatus.NEW,
          },
        },
      });

      if (orders.length === 0) {
        return;
      }

      const orderModel = orders[self.getRandom(1, orders.length)];

      yield orderModel.update({ status: orderStatus.CLOSED, closingDate: moment().unix() });
    }).catch(error => self.errorHandler(error));
  }

  start() {
    this.timers.newVisitor = setInterval(() => this.addNewVisitor(), 10000);
    this.timers.newOrder = setInterval(() => this.addNewOrder(), 15000);
    this.timers.closeOrder = setInterval(() => this.closeOrder(), 20000);
  }
}

module.exports = new Generator();
