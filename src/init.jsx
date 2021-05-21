import React from 'react';
import i18next from 'i18next';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import App from './components/App.jsx';
import resources from './locales/index.js';
import reducer from './slices/index.js';

import logger from './lib/logger.js';

export default async () => {
  const store = configureStore({
    reducer,
  });

  const log = logger('init');
  log('init');
  const i18n = i18next.createInstance();
  await i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'ru',
    });

  const vdom = (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </I18nextProvider>
    </Provider>
  );

  console.log('test');
  console.log(process);
  console.log(process.env.REACT_APP_API_URL);

  return vdom;
};
