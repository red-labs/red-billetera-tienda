import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Input,
  Alert
} from "reactstrap";
import { copy as copyIcon } from "../utils/icons";
import React, { Component } from "react";
import QRCode from "qrcode.react";
import copy from "clipboard-copy";
import { withI18n } from "react-i18next";
import { Screen, ScreenHeader, ScreenBody } from "./Screen";

interface Props {
  open: boolean;
  toggle: () => void;
  address: string;
  t: Function;
}

interface State {
  alertOpen: boolean;
}

class Receive extends Component<Props, State> {
  state = {
    alertOpen: false
  };

  copy = () => {
    copy(this.props.address);
    this.setState({ alertOpen: true });
    setTimeout(() => {
      this.setState({ alertOpen: false });
    }, 10000);
  };

  render() {
    const { t } = this.props;
    if (!this.props.open) {
      this.state.alertOpen = false;
    }
    return (
      <Screen isOpen={this.props.open} toggle={this.props.toggle}>
        <ScreenHeader toggle={this.props.toggle}>{t("receive")}</ScreenHeader>
        <ScreenBody>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column"
            }}
          >
            <QRCode size={240} renderAs="svg" value={this.props.address} />

            <Input
              style={{ width: 240, marginTop: 10, marginBottom: 10 }}
              value={this.props.address}
            />
            <Button onClick={this.copy} block size="lg">
              {copyIcon("#fff")} {t("copyAddress")}
            </Button>
          </div>
        </ScreenBody>
        <div
          style={{
            position: "fixed",
            bottom: 10,
            left: 10,
            right: 10,
            display: "flex",
            justifyContent: "center",
            textAlign: "center"
          }}
        >
          <Alert
            style={{ width: "100%" }}
            isOpen={this.state.alertOpen}
            color="success"
            toggle={() => this.setState({ alertOpen: false })}
          >
            {t("addressCopied")}
          </Alert>
        </div>
      </Screen>
    );
  }
}

export default withI18n()(Receive);
