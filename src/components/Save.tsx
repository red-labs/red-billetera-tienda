import { Button, FormGroup, Input, Alert } from "reactstrap";
import { copy as copyIcon } from "../utils/icons";
import React, { Component } from "react";
import copy from "clipboard-copy";
import { withI18n } from "react-i18next";
import { Subscribe } from "unstated";
import { AppContainer } from "../store";
import { Screen, ScreenHeader, ScreenBody } from "./Screen";
import RenderAlert from "./Alerts";

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
              <div style={{ marginBottom: "1rem" }}>
                {t("privateKeySecurity")}
              </div>
              <FormGroup>
                <Input
                  name="copyPrivateKey"
                  id="copyPrivateKey"
                  placeholder="0x..."
                  value={context.state.xDaiWallet.privateKey}
                />
              </FormGroup>
              <Button
                onClick={() => this.copy(context.state.xDaiWallet.privateKey)}
                block
                size="lg"
                style={{ marginBottom: "1rem" }}
              >
                {copyIcon("#fff")} {t("copyPrivateKey")}
              </Button>

              <p />
              <div>{t("pastePrivateKey")}</div>

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
            </ScreenBody>
            <RenderAlert
              msg="privateKeyCopied"
              color="success"
              isOpen={this.state.saveAlertOpen}
              toggle={() => this.setState({ saveAlertOpen: false })}
            />
            <RenderAlert
              msg="privateKeyRestored"
              color="success"
              isOpen={this.state.restoreAlertOpen}
              toggle={() => this.setState({ restoreAlertOpen: false })}
            />
            <RenderAlert
              msg="failedToRestorePk"
              color="danger"
              isOpen={this.state.failedRestoreAlertOpen}
              toggle={() => this.setState({ failedRestoreAlertOpen: false })}
            />
            <RenderAlert
              msg="pleaseWait"
              color="primary"
              isOpen={this.state.pleaseWait}
              toggle={() => this.setState({ pleaseWait: false })}
            />
          </Screen>
        )}
      </Subscribe>
    );
  }
}

export default withI18n()(Save);
