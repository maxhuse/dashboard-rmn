const Sequelize = require('sequelize');
const { orderStatus } = require('../../shared/constants');

const Visitors = sequelize => (
  sequelize.define('visitor', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  }, {
    tableName: 'visitors',
    timestamps: false,
  })
);

const Orders = sequelize => (
  sequelize.define('order', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: Sequelize.DataTypes.STRING({ length: 10, binary: false }),
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
  })
);

module.exports = {
  Visitors,
  Orders,
};

