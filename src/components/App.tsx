import React from "react";
import Send from "./Send";
import Receive from "./Receive";
import Save from "./Save";
import { Button } from "reactstrap";
import Advanced from "./Advanced";
//@ts-ignore
import baseEmoji from "base-emoji";
import { withI18n } from "react-i18next";
import { ethers } from "ethers";
import { Currency } from "../types";
import { AppContainer } from "../store";
import { Subscribe } from "unstated";

enum Route {
  Main,
  Send,
  Receive,
  Save,
  Advanced
}

interface Props {
  i18n: any;
  t: Function;
}

function addressToEmoji(address: string) {
  const hash = ethers.utils.keccak256(address);
  const last2bytes = hash.slice(-4);
  const buf = new Buffer(last2bytes, "hex");
  return baseEmoji.toUnicode(buf);
}

function App(props: Props) {
  let { i18n, t } = props;

  return (
    <Subscribe to={[AppContainer]}>
      {(context: AppContainer) => (
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
              {context.state.xDaiWallet &&
                addressToEmoji(context.state.xDaiWallet.address)}{" "}
              {t("efectivo")}
            </h1>
            <h1>
              {!isNaN(Number(context.state.xDaiBalance))
                ? "$" + context.state.xDaiBalance
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
                onClick={() => context.setRoute(Route.Send)}
                style={{ flex: "1 1 0", maxWidth: 200, margin: 5 }}
                size="lg"
              >
                {t("send")}
              </Button>
              <Button
                onClick={() => context.setRoute(Route.Receive)}
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
                onClick={() => context.setRoute(Route.Save)}
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
                onClick={() => context.setRoute(Route.Advanced)}
                style={{ flex: "1 1 0", maxWidth: 410, margin: 5 }}
                size="sm"
              >
                {t("advanced")}
              </Button>
            </div>
          </div>
          <Send
            toggle={() => context.setRoute(Route.Main)}
            open={context.state.route === Route.Send}
            currency={Currency.XDAI}
          />
          <Receive
            address={context.state.xDaiWallet.address}
            toggle={() => context.setRoute(Route.Main)}
            open={context.state.route === Route.Receive}
          />
          <Save
            privateKey={context.state.xDaiWallet.privateKey}
            toggle={() => context.setRoute(Route.Main)}
            open={context.state.route === Route.Save}
          />
          <Advanced
            toggle={() => context.setRoute(Route.Main)}
            open={context.state.route === Route.Advanced}
          />
        </div>
      )}
    </Subscribe>
  );
}

export default withI18n()(App);
