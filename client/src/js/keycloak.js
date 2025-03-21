import Keycloak from "keycloak-js";

import store from "./store";
import { UPDATE_AUTH_USER } from "./actions/types";
import { instance } from "./api/api";

const ssoConfig = {
  url: window.RUNTIME_REACT_APP_SSO_HOST ? window.RUNTIME_REACT_APP_SSO_HOST : process.env.REACT_APP_SSO_HOST,
  realm: window.RUNTIME_REACT_APP_SSO_REALM ? window.RUNTIME_REACT_APP_SSO_REALM : process.env.REACT_APP_SSO_REALM,
  clientId: window.RUNTIME_REACT_APP_SSO_CLIENT
    ? window.RUNTIME_REACT_APP_SSO_CLIENT
    : process.env.REACT_APP_SSO_CLIENT
};

const KEYCLOAK_INIT_OPTIONS = {
  onLoad: "login-required",
  checkLoginIframe: false,
  pkceMethod: "S256",
};

export const keycloakInit = async (onSuccess) => {
  const keycloak = new Keycloak(ssoConfig);

  const getKeycloakUserInfo = async () => {
    const userInfo = await keycloak.loadUserInfo();
    store.dispatch({ type: UPDATE_AUTH_USER, payload: userInfo });
  };

  keycloak.onAuthSuccess = () => {
    getKeycloakUserInfo();
  };
  
  keycloak.onAuthRefreshSuccess = () => {
    getKeycloakUserInfo();
  };

  const authenticated = await keycloak.init(KEYCLOAK_INIT_OPTIONS);

  instance.interceptors.request.use(
    (config) =>
      new Promise((resolve) =>
        keycloak
          .updateToken(5)
          .then(() => {
            config.headers.Authorization = `Bearer ${keycloak.token}`;
            resolve(config);
          })
          .catch(async () => {
            await keycloak.login();
          })
      )
  );

  onSuccess(authenticated);
};
