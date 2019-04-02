import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';

import Keycloak from 'keycloak-js';

import App from './js/App';
import Api from './js/api/api';
import reducers from './js/reducers';

import { UPDATE_AUTH_USER } from './js/actions/types';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(reduxThunk)));

const keycloakConfig = {
  url: window.RUNTIME_REACT_APP_SSO_HOST ? window.RUNTIME_REACT_APP_SSO_HOST : process.env.REACT_APP_SSO_HOST,
  realm: window.RUNTIME_REACT_APP_SSO_REALM ? window.RUNTIME_REACT_APP_SSO_REALM : process.env.REACT_APP_SSO_REALM,
  clientId: window.RUNTIME_REACT_APP_SSO_CLIENT
    ? window.RUNTIME_REACT_APP_SSO_CLIENT
    : process.env.REACT_APP_SSO_CLIENT,
};

const keycloak = Keycloak(keycloakConfig);

keycloak.onAuthSuccess = () => {
  getKeycloakUserInfo();
};

keycloak.onAuthRefreshSuccess = () => {
  getKeycloakUserInfo();
};

function getKeycloakUserInfo() {
  keycloak.loadUserInfo().success(data => {
    store.dispatch({ type: UPDATE_AUTH_USER, payload: data });
  });
}

keycloak
  .init({ onLoad: 'login-required' })
  .success(authenticated => {
    if (authenticated) {
      ReactDOM.render(
        <Provider store={store}>
          <App />
        </Provider>,
        document.getElementById('root')
      );
    }
  })
  .error(() => {
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
