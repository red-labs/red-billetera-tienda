import React, { Component } from "react";
import Send from "./Send";
import Receive from "./Receive";
import Save from "./Save";
import Transactions from "./Transactions";
import {
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu
} from "reactstrap";
import Advanced from "./Advanced";
//@ts-ignore
import baseEmoji from "base-emoji";
import { withI18n } from "react-i18next";
import { utils } from "ethers";
import { addressToEmoji } from "../utils";
import { Currency } from "../types";
import { Route, AppContainer } from "../store";
import { ScreenBody } from "./Screen";

interface Props {
  i18n: any;
  t: Function;
  store: AppContainer;
}

class App extends Component<Props> {
  async componentDidMount() {
    this.props.store.startPolls();
  }

  render() {
    let { i18n, t, store } = this.props;
    return (
      <div style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100vh"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <h1>{t("efectivo")}</h1>
            <div>
              <ButtonDropdown outline>
                <DropdownToggle caret>Language</DropdownToggle>
                <DropdownMenu>
                  <DropdownItem header>Header</DropdownItem>
                  <DropdownItem disabled>Action</DropdownItem>
                  <DropdownItem>Another Action</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>Another Action</DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
            </div>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <h1>
                {store.state.xDaiWallet &&
                  addressToEmoji(store.state.xDaiWallet.address)}{" "}
              </h1>
              <h1 style={{ wordBreak: "normal" }}>
                {!isNaN(Number(store.state.xDaiBalance))
                  ? "$" +
                    Number(utils.formatEther(store.state.xDaiBalance!)).toFixed(
                      2
                    )
                  : t("loading")}
              </h1>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center"
              }}
            >
              <Button
                onClick={() => store.setRoute(Route.Receive)}
                style={{ flex: "1 1 0", maxWidth: 200, marginRight: 10 }}
                size="lg"
              >
                {t("receive")}
              </Button>
              <Button
                onClick={() => store.setRoute(Route.Send)}
                style={{ flex: "1 1 0", maxWidth: 200 }}
                size="lg"
              >
                {t("send")}
              </Button>
            </div>
          </div>

          <div>
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
                color="link"
                onClick={() => store.setRoute(Route.Advanced)}
                style={{ flex: "1 1 0", maxWidth: 410, margin: 5 }}
                size="sm"
              >
                {t("advanced")}
              </Button>
            </div>
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
          toggle={() => store.setRoute(Route.Main)}
          open={store.state.route === Route.Save}
        />
        <Transactions
          toggle={() => store.setRoute(Route.Main)}
          open={store.state.route === Route.Transactions}
        />
        <Advanced
          toggle={() => store.setRoute(Route.Main)}
          open={store.state.route === Route.Advanced}
        />
      </div>
    );
  }
}

export default withI18n()(App);

/* <div className="d-flex w-100 text-center justify-content-center">
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
          </div> */
