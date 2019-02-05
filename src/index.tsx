import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.min.css";
import "./utils/i18n";
import { AppContainer } from "./store";
import { Subscribe, Provider } from "unstated";
import App from "./components/App"

ReactDOM.render(
  <Provider>
    <Subscribe to={[AppContainer]}>
      {(store: AppContainer) => (
        <App
          store={store}
        />
      )}
  </Subscribe>
</Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
