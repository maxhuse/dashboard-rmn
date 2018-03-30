const express = require('express');
const getToday = require('./get');

const today = express();

today.get('/', getToday);

module.exports = today;
