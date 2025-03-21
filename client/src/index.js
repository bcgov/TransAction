import "react-app-polyfill/ie9";
import "core-js/es/array";
import "core-js/es/object";
import "core-js/es/map";
import "core-js/es/set";
import "core-js/es/promise";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./js/App";
import store from "./js/store";
import { keycloakInit } from "./js/keycloak";
import initFontAwesome from "./js/fontAwesome";

// CustomEvent Polyfill for IE11, used by Reactstrap Carousel
(function () {
  if (typeof window.CustomEvent === "function") return false;

  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: null };
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  window.CustomEvent = CustomEvent;
})();

initFontAwesome();

keycloakInit((authenticated) => {
  if (authenticated) {
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById("root")
    );
  }
});
