import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.min.css";
import "./utils/i18n";
import { Provider } from "unstated";
// import { ethers } from "ethers";
// import { ImmortalDB } from "immortal-db";
// import { Currency } from "./types";
// import { randomHex } from "./randomHex";
// import { AppProvider } from "./Provider";

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
