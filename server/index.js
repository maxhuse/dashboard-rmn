const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');
const i18next = require('i18next');
const helmet = require('helmet');
const socket = require('./socket');
const logger = require('./logger');
const generator = require('./generator');

const api = require('./routes');

const app = express();

const { en } = require('../static/translations/index');

app.use(helmet());

// Initialize translations
i18next.init({
  lng: 'en',
  resources: {
    en: { translation: en },
  },
}, () => {
  // Initialized and ready to go!
  // Geronimo!
});

// Hot mode middlewares
if (process.env.NODE_ENV === 'hot') {
  console.log('It\'s hot!'); // eslint-disable-line no-console

  /* eslint-disable global-require, import/no-extraneous-dependencies */
  const webpackConfig = require('../webpack.config');
  const webpack = require('webpack');
  const compiler = webpack(webpackConfig);

  // HMR
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    historyApiFallback: true,
  }));

  app.use(require('webpack-hot-middleware')(compiler));
  /* eslint-enable global-require, import/no-extraneous-dependencies */
}

// Dev server provide static files
if (process.env.NODE_ENV === 'hot' || process.env.NODE_ENV === 'development') {
  // Favicon
  app.use(favicon(path.join(__dirname, '../static/img/favicon.ico')));

  // Public files
  app.use('/public', express.static(path.join(__dirname, '../public')));
}

// API
app.use('/api', api);

// Index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

const server = app.listen(3000, 'localhost', (err) => {
  if (err) {
    logger.log('error', err);

    return;
  }

  logger.log('info', 'server started', { port: 3000 });

  // Generate new visitors and orders
  if (process.env.NODE_ENV !== 'production') {
    generator.start();
  }
});

process.on('unhandledRejection', (error) => {
  logger.log('warn', error);
});

// set max request timeout
server.timeout = 15 * 60 * 1000;

// Open websocket connection
socket.connection();
