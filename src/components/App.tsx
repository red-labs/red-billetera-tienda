import React, { Component } from "react";
import Send from "./Send";
import Receive from "./Recieve";
import Save from "./Save";
import Recover from "./Recover";
import Transactions from "./Transactions";
import TransactionsScreen from "./TransactionsScreen";
import { downArrow, rightArrow, whatsAppIcon } from "../utils/icons";
import {
  Button,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu
} from "reactstrap";
import Advanced from "./Advanced";
import { withI18n } from "react-i18next";
import {
  addressToEmoji,
  convertToCOP,
  formatToDollars,
  subtractTxnCost
} from "../utils";
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
      if (i18n.language === "es" && usdcop) {
        return (
          <div>
            <div>
              <h2 style={{ display: "inline-block", wordBreak: "normal" }}>
                {"$" + convertToCOP(subtractTxnCost(xDaiBalance), usdcop)}
              </h2>
              {" pesos"}
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <h1 style={{ wordBreak: "normal" }}>
              {"$" + formatToDollars(subtractTxnCost(xDaiBalance))}
            </h1>
          </div>
        );
      }
    }
  };

  render() {
    let { t, store } = this.props;
    return (
      <div style={{ height: "90vh", display: "flex", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            maxWidth: 450,
            height: "100%",
            maxHeight: 900,
            margin: "auto",
            overflow: "hidden"
          }}
        >
          <div className="branding-container"

          >

            <h1 className="branding">Billetera</h1>
            <div >
              <Dropdown
                isOpen={this.state.languageDropdownOpen}
                toggle={() =>
                  this.setState({
                    languageDropdownOpen: !this.state.languageDropdownOpen
                  })
                }
              >
                <DropdownToggle >{t("⋮")}</DropdownToggle>
                <DropdownMenu className="dropdown-menu-right">
                  <DropdownItem onClick={() => store.setRoute(Route.Save)}>
                    Guardar
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => store.setRoute(Route.Recover)}>
                    Recuperar
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => store.setRoute(Route.Receive)}>
                    Recibir
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
<div className="top-container">
          <div >
            <div className="account-card"
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
              <Button className="receive-button"
                onClick={() => store.setRoute(Route.Send)}
                style={{ flex: "1 1 0" }}
                size="lg"
              >
                enviar
              </Button>


            </div>
          </div>
          </div>
         <div className="content-container">
            <div className="transaction-items">
                <Transactions
                  viewTransactions={() => store.setRoute(Route.Transactions)}
                />
             </div>

          <div>
          {/* the below navigation was moved to the menu at the top */}
            {/*<Button
               className="save"
              onClick={() => store.setRoute(Route.Save)}
              size="lg"
              block
            >
              {t("saveRestore")}
            </Button>
            <Button
               className="save"
              onClick={() => store.setRoute(Route.Recover)}
              size="lg"
              block
            >
              {t("Recover")}
            </Button>*/}
               <Button
               size="lg"
               block
               className="whatsapp-button" href="https://www.whatsapp.com/business/"
               >
               Contacto en  {whatsAppIcon()} </Button>

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
        </div>


        <Send
          toggle={() => store.setRoute(Route.Main)}
          open={store.state.route === Route.Send}
          currency={i18n.language === "es" ? Currency.COP : Currency.XDAI}
        />
        <Receive
          toggle={() => store.setRoute(Route.Main)}
          open={store.state.route === Route.Receive}
        />
        <Save
          toggle={() => store.setRoute(Route.Main)}
          open={store.state.route === Route.Save}
        />
        <Recover
        toggle={() => store.setRoute(Route.Main)}
        open={store.state.route === Route.Recover}
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
