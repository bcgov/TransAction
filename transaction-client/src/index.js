import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';

import Keycloak from 'keycloak-js';

import App from './js/App';
import Api from './js/api/api';
import reducers from './js/reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(reduxThunk)));

const keycloakConfig = {
  url: process.env.REACT_APP_SSO_HOST,
  realm: process.env.REACT_APP_SSO_REALM,
  clientId: process.env.REACT_APP_SSO_CLIENT,
};

const keycloak = Keycloak(keycloakConfig);

keycloak
  .init({ onLoad: 'login-required' })
  .success(function(authenticated) {
    if (authenticated) {
      ReactDOM.render(
        <Provider store={store}>
          <App />
        </Provider>,
        document.getElementById('root')
      );
    }
  })
  .error(function() {
    //alert('failed to initialize');
  });

Api.interceptors.request.use(
  config =>
    new Promise(resolve =>
      keycloak
        .updateToken(5)
        .success(() => {
          config.headers.Authorization = `Bearer ${keycloak.token}`;
          resolve(config);
        })
        .error(() => {
          keycloak.login();
        })
    )
);
