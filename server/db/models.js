const Sequelize = require('sequelize');
const { orderStatus } = require('../../shared/constants');

const visitors = sequelize => (
  sequelize.define('visitor', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  }, {
    tableName: 'visitors',
    timestamps: false,
    underscored: true,
  })
);

const visits = (sequelize) => {
  const Visit = sequelize.define('visit', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    visitorId: {
      field: 'visitor_id',
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'visits',
    timestamps: false,
    underscored: true,
  });

  // Associations
  Visit.belongsTo(sequelize.models.visitor, { foreignKey: 'visitorId' });
  sequelize.models.visitor.hasMany(Visit, { foreignKey: 'visitorId' });

  return Visit;
};

const products = sequelize => (
  sequelize.define('product', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.DataTypes.STRING({
        length: 255,
        binary: false,
      }),
      allowNull: false,
    },
    price: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'products',
    timestamps: false,
    underscored: true,
  })
);

const orders = (sequelize) => {
  const Order = sequelize.define('order', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    visitorId: {
      type: Sequelize.DataTypes.INTEGER,
      field: 'visitor_id',
      allowNull: false,
    },
    productId: {
      type: Sequelize.DataTypes.INTEGER,
      field: 'product_id',
      allowNull: false,
    },
    date: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: Sequelize.DataTypes.STRING({
        length: 10,
        binary: false,
      }),
      allowNull: false,
      defaultValue: orderStatus.NEW,
    },
    value: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'orders',
    timestamps: false,
    underscored: true,
  });

  // Associations
  Order.belongsTo(sequelize.models.visitor, { foreignKey: 'visitorId' });
  sequelize.models.visitor.hasMany(Order, { foreignKey: 'visitorId' });

  Order.belongsTo(sequelize.models.product, { foreignKey: 'productId' });
  sequelize.models.product.hasMany(Order, { foreignKey: 'productId' });

  return Order;
};

module.exports = {
  visitors,
  visits,
  products,
  orders,
};

