import { Button, FormGroup, Input, Alert } from "reactstrap";
import { copy as copyIcon } from "../utils/icons";
import React, { Component } from "react";
import copy from "clipboard-copy";
import { withI18n } from "react-i18next";
import { Subscribe } from "unstated";
import { AppContainer } from "../store";
import { Screen, ScreenHeader, ScreenBody } from "./Screen";

interface Props {
  open: boolean;
  toggle: () => void;
  t: Function;
}

interface State {
  saveAlertOpen: boolean;
  restoreAlertOpen: boolean;
  failedRestoreAlertOpen: boolean;
  pleaseWait: boolean;
  inputValue: string;
}

class Save extends Component<Props, State> {
  state = {
    saveAlertOpen: false,
    restoreAlertOpen: false,
    failedRestoreAlertOpen: false,
    pleaseWait: false,
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
          <Screen isOpen={this.props.open} toggle={this.props.toggle}>
            <ScreenHeader toggle={this.props.toggle}>
              {t("saveRestore")}
            </ScreenHeader>
            <ScreenBody>
              <FormGroup>
                <Input
                  name="copyPrivateKey"
                  id="copyPrivateKey"
                  placeholder="0x..."
                  value={context.state.xDaiWallet.privateKey}
                />
              </FormGroup>
              {/* <Input value={context.state.xDaiWallet.privateKey} /> */}
              <Button
                onClick={() => this.copy(context.state.xDaiWallet.privateKey)}
                block
                size="lg"
                style={{ marginBottom: "1rem" }}
              >
                {copyIcon("#fff")} {t("copyPrivateKey")}
              </Button>

              <div style={{ marginBottom: "1rem" }}>
                {t("privateKeySecurity")}
              </div>

              <FormGroup>
                <Input
                  name="restorePrivateKey"
                  id="restorePrivateKey"
                  placeholder="0x..."
                  onChange={event => {
                    this.setState({ inputValue: event.target.value.trim() });
                  }}
                  value={this.state.inputValue}
                />
              </FormGroup>
              <Button
                onClick={async () => {
                  if (
                    this.state.inputValue !==
                    context.state.xDaiWallet.privateKey
                  ) {
                    try {
                      this.setState({ pleaseWait: true });
                      await context.restorePrivateKey(this.state.inputValue);
                      this.setState({ pleaseWait: false });
                      window.location.reload();
                    } catch (e) {
                      console.error(e);
                      this.setState({
                        pleaseWait: false,
                        failedRestoreAlertOpen: true
                      });
                      setTimeout(() => {
                        this.setState({ failedRestoreAlertOpen: false });
                      }, 10000);
                    }
                  } else {
                    this.props.toggle();
                  }
                }}
                block
                size="lg"
                style={{ marginBottom: "1rem" }}
              >
                {t("restorePrivateKey")}
              </Button>
              {/* <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column"
                }}
              >
                <Input
                  name="restorePrivateKey"
                  placeholder={"0x..."}
                  onChange={event => {
                    this.setState({ inputValue: event.target.value.trim() });
                  }}
                />

              </div> */}
              <div>{t("pastePrivateKey")}</div>
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
                isOpen={this.state.failedRestoreAlertOpen}
                color="danger"
                toggle={() => this.setState({ failedRestoreAlertOpen: false })}
              >
                {t("failedToRestorePk")}
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
                isOpen={this.state.pleaseWait}
                color="primary"
                toggle={() => this.setState({ failedRestoreAlertOpen: false })}
              >
                {t("pleaseWait")}
              </Alert>
            </div>
          </Screen>
        )}
      </Subscribe>
    );
  }
}

export default withI18n()(Save);
