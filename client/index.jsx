/* global window, document */
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import i18next from 'i18next';
import moment from 'moment';
import Promise from 'bluebird';
import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';
import '../static/scss/app.scss';
import '../static/img/favicon.ico';
import * as languages from '../static/translations';
import App from 'components/app';

import ordersStore from 'stores/orders';

// Substitution Promise from babel to bluebird
Promise.config({ cancellation: true });
require('babel-runtime/core-js/promise').default = Promise; // eslint-disable-line

const { en } = languages;

const currentLanguage = window.localStorage.getItem('language') || 'en';

moment.locale(currentLanguage);

const rootElement = document.getElementById('root');

const stores = {
  ordersStore,
};

i18next.init({
  lng: currentLanguage,
  resources: {
    en: {
      translation: en,
    },
  },
}, () => {
  // initialized and ready to go!
  // GERONIMO!
  render(
    <AppContainer>
      <Provider {...stores}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    rootElement
  );

  if (module.hot) {
    module.hot.accept();
  }
});
