const Sequelize = require('sequelize');
const co = require('co');
const moment = require('moment');
const { orderStatus } = require('../shared/constants')
const config = require('../server/config');
const models = require('../server/db/models');

const sequelize = new Sequelize(config.sequelize);

// Define models that represents tables
Object.keys(models).forEach(key => models[key](sequelize));

co(function* gen() {
  // Trigger sync that create the tables
  yield sequelize.sync();

  console.log('Tables created');

  // Create some data
  const visitor1Model = yield sequelize.models.visitor.create();
  const visitor2Model = yield sequelize.models.visitor.create();
  const visitor3Model = yield sequelize.models.visitor.create();

  const jeansModel = yield sequelize.models.product.create({ name: 'Jeans', price: 20 });
  const shirtModel = yield sequelize.models.product.create({ name: 'Shirt', price: 10 });
  const underwearModel = yield sequelize.models.product.create({ name: 'Underwear', price: 5 });
  const pantsModel = yield sequelize.models.product.create({ name: 'Pants', price: 15 });
  const skirtModel = yield sequelize.models.product.create({ name: 'Skirt', price: 13 });
  const tshirtModel = yield sequelize.models.product.create({ name: 'T-Shirt', price: 8 });
  const socksModel = yield sequelize.models.product.create({ name: 'Socks', price: 2 });
  const jacketModel = yield sequelize.models.product.create({ name: 'Jacket', price: 50 });
  const anorakModel = yield sequelize.models.product.create({ name: 'Anorak', price: 55 });
  const sweaterModel = yield sequelize.models.product.create({ name: 'Sweater', price: 25 });
  const suitModel = yield sequelize.models.product.create({ name: 'Suit', price: 200 });

  const currentTimestamp = moment().unix();

  const visit1Model = yield sequelize.models.visit.create({
    visitorId: visitor1Model.get('id'),
    date: currentTimestamp,
  });
  const visit2Model = yield sequelize.models.visit.create({
    visitorId: visitor2Model.get('id') ,
    date: currentTimestamp + 10,
  });
  const visit3Model = yield sequelize.models.visit.create({
    visitorId: visitor3Model.get('id') ,
    date: currentTimestamp + 1000,
  });
  const visit4Model = yield sequelize.models.visit.create({
    visitorId: visitor3Model.get('id') ,
    date: currentTimestamp + 3000,
  });
  const visit5Model = yield sequelize.models.visit.create({
    visitorId: visitor2Model.get('id') ,
    date: currentTimestamp + 4000,
  });

  const order1Model = yield sequelize.models.order.create({
    visitorId: visitor1Model.get('id'),
    productId: jeansModel.get('id'),
    creationDate: currentTimestamp + 50,
    value: jeansModel.get('price'),
  });
  const order2Model = yield sequelize.models.order.create({
    visitorId: visitor2Model.get('id'),
    productId: shirtModel.get('id'),
    creationDate: currentTimestamp + 1000,
    value: shirtModel.get('price'),
  });
  const order3Model = yield sequelize.models.order.create({
    visitorId: visitor1Model.get('id'),
    productId: tshirtModel.get('id'),
    creationDate: currentTimestamp + 2000,
    value: tshirtModel.get('price'),
  });
  const order4Model = yield sequelize.models.order.create({
    visitorId: visitor3Model.get('id'),
    productId: skirtModel.get('id'),
    creationDate: currentTimestamp + 10000,
    closingDate: currentTimestamp + 20000,
    status: orderStatus.CLOSED,
    value: skirtModel.get('price'),
  });
  const order5Model = yield sequelize.models.order.create({
    visitorId: visitor2Model.get('id'),
    productId: sweaterModel.get('id'),
    creationDate: currentTimestamp + 9000,
    closingDate: currentTimestamp + 11000,
    status: orderStatus.CLOSED,
    value: sweaterModel.get('price'),
  });
  const order6Model = yield sequelize.models.order.create({
    visitorId: visitor3Model.get('id'),
    productId: jacketModel.get('id'),
    creationDate: currentTimestamp - 180000,
    closingDate: currentTimestamp - 120000,
    status: orderStatus.CLOSED,
    value: jacketModel.get('price'),
  });

  console.log('Models created');

  sequelize.close();
});

