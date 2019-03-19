import React, { Component } from "react";
import Send from "./Send";
import Receive from "./Receive";
import Save from "./Save";
import Transactions from "./Transactions";
import TransactionsScreen from "./TransactionsScreen";
import {
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu
} from "reactstrap";
import Advanced from "./Advanced";
import { withI18n } from "react-i18next";
import { addressToEmoji, convertToCOP, roundDaiDown } from "../utils";
import { Currency } from "../types";
import { Route, AppContainer } from "../store";
import Alert from "./Alerts";
import i18n from "i18next";

interface Props {
  i18n: any;
  t: Function;
  store: AppContainer;
}

interface State {
  languageDropdownOpen: boolean;
}

class App extends Component<Props> {
  state = {
    languageDropdownOpen: false
  };
  async componentDidMount() {
    this.props.store.startPolls();
    if (i18n.language === "es") this.props.store.startUsdCopRatePoll();
  }

  displayValue = (store: AppContainer, t: Function) => {
    const { xDaiBalance, usdcop } = store.state;
    if (isNaN(xDaiBalance as any)) {
      return <h1 style={{ wordBreak: "normal" }}>{t("loading")}</h1>;
    }

    if (xDaiBalance) {
      return (
        <div>
          <h1 style={{ wordBreak: "normal" }}>
            {"$" + roundDaiDown(xDaiBalance)}
          </h1>
          {i18n.language === "es" && usdcop
            ? "($" + convertToCOP(xDaiBalance, usdcop) + " COP)"
            : ""}
        </div>
      );
    }
  };

  render() {
    let { t, store } = this.props;
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
            margin: "auto",
            overflow: "hidden"
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
              <ButtonDropdown
                style={{
                  width: 159
                }}
                isOpen={this.state.languageDropdownOpen}
                toggle={() =>
                  this.setState({
                    languageDropdownOpen: !this.state.languageDropdownOpen
                  })
                }
              >
                <DropdownToggle caret>{t("language")}</DropdownToggle>
                <DropdownMenu className="dropdown-menu-right">
                  <DropdownItem onClick={() => i18n.changeLanguage("en")}>
                    English (USD)
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      this.props.store.startUsdCopRatePoll();
                      i18n.changeLanguage("es");
                    }}
                  >
                    Español (COP)
                  </DropdownItem>
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
              <div style={{ verticalAlign: "middle" }}>
                {this.displayValue(store, t)}
              </div>
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
            viewTransactions={() => store.setRoute(Route.Transactions)}
          />

          <div>
            <Button
              style={{ marginBottom: "1rem" }}
              onClick={() => store.setRoute(Route.Save)}
              size="lg"
              block
            >
              {t("saveRestore")}
            </Button>

            {/* <div style={{ height: 75 }} /> */}
            {/* <Button
              color="link"
              onClick={() => store.setRoute(Route.Advanced)}
              block
            >
              {t("advanced")}
            </Button> */}
          </div>
        </div>
        <Send
          toggle={() => store.setRoute(Route.Main)}
          open={store.state.route === Route.Send}
          currency={Currency.XDAI}
        />
        <Receive
          toggle={() => store.setRoute(Route.Main)}
          open={store.state.route === Route.Receive}
        />
        <Save
          toggle={() => store.setRoute(Route.Main)}
          open={store.state.route === Route.Save}
        />
        <TransactionsScreen
          toggle={() => store.setRoute(Route.Main)}
          open={store.state.route === Route.Transactions}
        />
        <Advanced
          toggle={() => store.setRoute(Route.Main)}
          open={store.state.route === Route.Advanced}
        />
        <Alert
          msg="txSending"
          color="primary"
          isOpen={store.state.txSendingAlert}
          toggle={() => store.setState({ txSendingAlert: false })}
        />
        <Alert
          msg="txSuccess"
          color="success"
          isOpen={store.state.txSuccessAlert}
          toggle={() => store.setState({ txSuccessAlert: false })}
        />
        <Alert
          msg="txError"
          color="danger"
          isOpen={store.state.txErrorAlert}
          toggle={() => store.setState({ txErrorAlert: false })}
        />
        <Alert
          msg="privateKeyCopied"
          color="success"
          isOpen={store.state.saveAlertOpen}
          toggle={() => store.setState({ saveAlertOpen: false })}
        />
        <Alert
          msg="privateKeyRestored"
          color="success"
          isOpen={store.state.restoreAlertOpen}
          toggle={() => store.setState({ restoreAlertOpen: false })}
        />
        <Alert
          msg="failedToRestorePk"
          color="danger"
          isOpen={store.state.failedRestoreAlertOpen}
          toggle={() => store.setState({ failedRestoreAlertOpen: false })}
        />
        <Alert
          msg="pleaseWait"
          color="primary"
          isOpen={store.state.pleaseWaitAlertOpen}
          toggle={() => store.setState({ pleaseWaitAlertOpen: false })}
        />
        <Alert
          msg="addressCopied"
          isOpen={store.state.addressCopiedAlertOpen}
          color="success"
          toggle={() => store.setState({ addressCopiedAlertOpen: false })}
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
