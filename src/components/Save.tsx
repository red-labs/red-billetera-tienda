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
import { Subscribe } from "unstated";
import { AppContainer } from "../store";

interface Props {
  open: boolean;
  toggle: () => void;
  t: Function;
}

interface State {
  saveAlertOpen: boolean;
  restoreAlertOpen: boolean;
  inputValue: string;
}

class Save extends Component<Props, State> {
  state = {
    saveAlertOpen: false,
    restoreAlertOpen: false,
    inputValue: ""
  };

  copy = (privateKey: string) => {
    copy(privateKey);
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
      <Subscribe to={[AppContainer]}>
        {(context: AppContainer) => (
          <Modal isOpen={this.props.open} toggle={this.props.toggle}>
            <ModalHeader toggle={this.props.toggle}>
              {t("saveRestore")}
            </ModalHeader>
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
                  value={context.state.xDaiWallet.privateKey}
                />
                <Button
                  onClick={() => this.copy(context.state.xDaiWallet.privateKey)}
                  block
                  style={{ maxWidth: 240, margin: 5 }}
                  size="lg"
                >
                  {copyIcon("#fff")} {t("copyPrivateKey")}
                </Button>
              </div>
              <div>{t("privateKeySecurity")}</div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column"
                }}
              >
                <Input
                  name="restorePrivateKey"
                  style={{ width: 240, marginTop: 10, marginBottom: 10 }}
                  placeholder={"0x..."}
                  onChange={event => {
                    this.setState({ inputValue: event.target.value.trim() });
                  }}
                />
                <Button
                  onClick={() =>
                    context.restorePrivateKey(this.state.inputValue)
                  }
                  block
                  style={{ maxWidth: 240, margin: 5 }}
                  size="lg"
                >
                  {t("restorePrivateKey")}
                </Button>
              </div>
              <div>{t("pastePrivateKey")}</div>
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
          </Modal>
        )}
      </Subscribe>
    );
  }
}

export default withI18n()(Save);
