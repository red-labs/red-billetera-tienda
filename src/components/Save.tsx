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
import copy from "clipboard-copy";
import { withI18n } from "react-i18next";

interface Props {
  open: boolean;
  toggle: () => void;
  privateKey: string;
  t: Function;
}

interface State {
  saveAlertOpen: boolean;
  restoreAlertOpen: boolean;
}

class Save extends Component<Props, State> {
  state = {
    saveAlertOpen: false,
    restoreAlertOpen: false
  };

  copy = () => {
    copy(this.props.privateKey);
    this.setState({ saveAlertOpen: true });
    setTimeout(() => {
      this.setState({ saveAlertOpen: false });
    }, 3000);
  };

  render() {
    const { t } = this.props;
    if (!this.props.open) {
      this.state.saveAlertOpen = false;
      this.state.restoreAlertOpen = false;
    }
    return (
      <Modal isOpen={this.props.open} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>{t("saveRestore")}</ModalHeader>
        <ModalBody>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column"
            }}
          >
            <Input
              style={{ width: 240, marginTop: 10, marginBottom: 10 }}
              value={this.props.privateKey}
            />
            <Button
              onClick={this.copy}
              block
              style={{ maxWidth: 240, margin: 5 }}
              size="lg"
            >
              {copyIcon("#fff")} {t("copyPrivateKey")}
            </Button>
          </div>
          <div>
            Your private key is what allows your wallet to send and receive
            money. Every account has a different private key. We recommend that
            you copy it and back it up by saving it somewhere on your phone, or
            texting or emailing it to yourself. But don't let anyone else see
            it. If someone else has your private key they will be able to access
            the money in this wallet.
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column"
            }}
          >
            <Input
              style={{ width: 240, marginTop: 10, marginBottom: 10 }}
              placeholder={"0x..."}
            />
            <Button block style={{ maxWidth: 240, margin: 5 }} size="lg">
              {t("restorePrivateKey")}
            </Button>
          </div>
        </ModalBody>
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
            isOpen={this.state.saveAlertOpen}
            color="success"
            toggle={() => this.setState({ saveAlertOpen: false })}
          >
            {t("privateKeyCopied")}
          </Alert>
        </div>
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
            isOpen={this.state.restoreAlertOpen}
            color="success"
            toggle={() => this.setState({ restoreAlertOpen: false })}
          >
            {t("privateKeyRestored")}
          </Alert>
        </div>
        <div>Paste your private key here to restore your wallet.</div>
      </Modal>
    );
  }
}

export default withI18n()(Save);
