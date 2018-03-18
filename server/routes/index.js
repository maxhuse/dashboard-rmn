const express = require('express');
const bodyParser = require('body-parser');
const { httpCodes } = require('./../constants');

// Middlewares
const errorMiddleware = require('./../middlewares/error');

// Routes
// const ordersRoute = require('./orders/index');

const api = express();

// Basic middlewares
api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());

// api.use('/orders', ordersRoute);

// 404 middleware
api.use('*', (req, res) => res.status(httpCodes.NOT_FOUND).send({}));

// Error-handler middleware
api.use(errorMiddleware);

module.exports = api;
