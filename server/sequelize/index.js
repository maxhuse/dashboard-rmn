const Sequelize = require('sequelize');
const config = require('../config');
const models = require('./models');

const sequelize = new Sequelize(config.sequelize);

// Define all models
Object.keys(models).forEach(key => models[key](sequelize));

/*
* The function return string for SET in UPDATE command
* @param {object} fields - Object with fields for insertion
* @returns {string} result - String for insertion to UPDATE
* */
// const generateUpdateFields = (fields) => {
//   let result = '';
//
//   Object.keys(fields).forEach((key, index) => {
//     if (index > 0) {
//       result += ',';
//     }
//
//     result += `${key}=${sequelize.escape(fields[key])}`;
//   });
//
//   return result;
// };

module.exports = {
  sequelize,

  getOrders() {
    return sequelize.models.order.findAll();
  },

};
