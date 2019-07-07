import { Button, Modal, ModalBody, ModalHeader, Input } from "reactstrap";
import { copy as copyIcon } from "../utils/icons";
import React, { Component } from "react";
import QRCode from "qrcode.react";
import copy from "clipboard-copy";
import { withI18n } from "react-i18next";
import { Screen, ScreenHeader, ScreenBody } from "./Screen";
import Alert from "./Alerts";
import { AppContainer } from "../store";
import { Subscribe } from "unstated";

interface Props {
  open: boolean;
  toggle: () => void;
  t: Function;
}

class Receive extends Component<Props> {
  copy = (context: AppContainer) => {
    copy(context.state.xDaiWallet.address);
    context.setState({ addressCopiedAlertOpen: true });
    setTimeout(() => {
      context.setState({ addressCopiedAlertOpen: false });
    }, 10000);
  };

  render() {
    const { t } = this.props;
    return (
      <Subscribe to={[AppContainer]}>
        {(context: AppContainer) => (
          <Screen isOpen={this.props.open} toggle={this.props.toggle}>
            <ScreenHeader toggle={this.props.toggle}>
              {t("receive")}
            </ScreenHeader>
            <ScreenBody>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",

                }}
              >
              <h1 className="receive-title"> Tu Codigo</h1>
              <div className="qr-code">
                <QRCode
                  size={240}
                  renderAs="svg"
                  value={context.state.xDaiWallet.address}
                />
                </div>
                <Input
                  style={{ marginTop: 100, marginBottom: 10 }}
                  value={context.state.xDaiWallet.address}
                  readOnly
                />
                <Button onClick={() => this.copy(context)} block size="lg">
                  {copyIcon("#fff")} {t("copyAddress")}
                </Button>
              </div>
            </ScreenBody>
          </Screen>
        )}
      </Subscribe>
    );
  }
}

export default withI18n()(Receive);
