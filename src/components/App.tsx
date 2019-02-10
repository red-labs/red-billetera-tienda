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
import { addressToEmoji, formatDaiAmount } from "../utils";
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
      <div style={{ height: "100vh", display: "flex", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            paddingLeft: "1rem",
            paddingRight: "1rem",
            maxWidth: 450,
            height: "100%",
            maxHeight: 900,
            margin: "auto"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <h1 style={{ fontWeight: "normal" }}>{t("efectivo")}</h1>
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
                alignItems: "center",
                marginBottom: "2rem"
              }}
            >
              <h1>
                {store.state.xDaiWallet &&
                  addressToEmoji(store.state.xDaiWallet.address)}{" "}
              </h1>
              <h1 style={{ wordBreak: "normal" }}>
                {!isNaN(store.state.xDaiBalance as any)
                  ? formatDaiAmount(store.state.xDaiBalance!)
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
                style={{ flex: "1 1 0", marginRight: "1rem" }}
                size="lg"
              >
                {t("receive")}
              </Button>
              <Button
                onClick={() => store.setRoute(Route.Send)}
                style={{ flex: "1 1 0" }}
                size="lg"
              >
                {t("send")}
              </Button>
            </div>
          </div>

          <Transactions
            toggle={() => store.setRoute(Route.Main)}
            open={store.state.route === Route.Transactions}
          />

          <div>
            <Button onClick={() => store.setRoute(Route.Save)} size="lg" block>
              {t("saveRestore")}
            </Button>

            <Button
              color="link"
              onClick={() => store.setRoute(Route.Advanced)}
              block
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
          toggle={() => store.setRoute(Route.Main)}
          open={store.state.route === Route.Save}
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
