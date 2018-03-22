const express = require('express');
const getOrders = require('./get');

const orders = express();

orders.get('/', getOrders);

module.exports = orders;
