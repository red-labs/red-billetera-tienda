import React, { Component } from "react";
import Send from "./Send";
import Receive from "./Receive";
import Save from "./Save";
import Transactions from "./Transactions";
import { Button } from "reactstrap";
import Advanced from "./Advanced";
//@ts-ignore
import baseEmoji from "base-emoji";
import { withI18n } from "react-i18next";
import { ethers } from "ethers";
import { Currency } from "../types";
import { AppContainer } from "../store";
import { Route } from "../store/index"

interface Props {
  i18n: any;
  t: Function;
  store: AppContainer;
}


function addressToEmoji(address: string) {
  const hash = ethers.utils.keccak256(address);
  const last2bytes = hash.slice(-4);
  const buf = new Buffer(last2bytes, "hex");
  return baseEmoji.toUnicode(buf);
}

class App extends Component<Props> {

  componentDidMount () {
    this.props.store.fetchAndSetTxns();
    this.props.store.fetchAndSetBalances();
  }
  render() {
    let { i18n, t, store } = this.props;
    return (
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100vh"
          }}
        >
          <h1>
            {store.state.xDaiWallet &&
              addressToEmoji(store.state.xDaiWallet.address)}{" "}
            {t("efectivo")}
          </h1>
          <h1>
            {!isNaN(Number(store.state.xDaiBalance))
              ? "$" + store.state.xDaiBalance
              : t("loading")}
          </h1>
          <div className="d-flex w-100 text-center justify-content-center">
            <Button
              onClick={() => i18n.changeLanguage("en")}
              style={{ flex: "1 1 0", maxWidth: 200, margin: 5 }}
              size="lg"
            >
              English
            </Button>
            <Button
              onClick={() => i18n.changeLanguage("es")}
              style={{ flex: "1 1 0", maxWidth: 200, margin: 5 }}
              size="lg"
            >
              Español
            </Button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center"
            }}
          >
            <Button
              onClick={() => store.setRoute(Route.Send)}
              style={{ flex: "1 1 0", maxWidth: 200, margin: 5 }}
              size="lg"
            >
              {t("send")}
            </Button>
            <Button
              onClick={() => store.setRoute(Route.Receive)}
              style={{ flex: "1 1 0", maxWidth: 200, margin: 5 }}
              size="lg"
            >
              {t("receive")}
            </Button>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center"
            }}
          >
            <Button
              onClick={() => store.setRoute(Route.Save)}
              style={{ flex: "1 1 0", maxWidth: 410, margin: 5 }}
              size="lg"
            >
              {t("saveRestore")}
            </Button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center"
            }}
          >
            <Button
              outline
              onClick={() => store.setRoute(Route.Transactions)}
              style={{ flex: "1 1 0", maxWidth: 410, margin: 5 }}
              size="sm"
            >
              {t("transactions")}
            </Button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center"
            }}
          >
            <Button
              outline
              onClick={() => store.setRoute(Route.Advanced)}
              style={{ flex: "1 1 0", maxWidth: 410, margin: 5 }}
              size="sm"
            >
              {t("advanced")}
            </Button>
          </div>
        </div>
        <Send
          toggle={() => store.setRoute(Route.Main)}
          open={store.state.route === Route.Send}
          currency={Currency.XDAI}
        />
        <Receive
          address={store.state.xDaiWallet.address}
          toggle={() => store.setRoute(Route.Main)}
          open={store.state.route === Route.Receive}
        />
        <Save
          privateKey={store.state.xDaiWallet.privateKey}
          toggle={() => store.setRoute(Route.Main)}
          open={store.state.route === Route.Save}
        />
        <Transactions
          toggle={() => store.setRoute(Route.Main)}
          open={store.state.route === Route.Transactions}
          txns={store.state.transactions}
        />
        <Advanced
          toggle={() => store.setRoute(Route.Main)}
          open={store.state.route === Route.Advanced}
        />
        </div>
    );
  };
}

export default withI18n()(App);