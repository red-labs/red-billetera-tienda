import { Button, FormGroup, Input } from "reactstrap";
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
  inputValue: string;
}

class Recover extends Component<Props, State> {
  state = {
    inputValue: ""
  };

  copy = (context: AppContainer) => {
    copy(context.state.xDaiWallet.privateKey);
    context.setState({ saveAlertOpen: true });
    setTimeout(() => {
      context.setState({ saveAlertOpen: false });
    }, 3000);
  };

  render() {
    const { t } = this.props;
    return (
      <Subscribe to={[AppContainer]}>
        {(context: AppContainer) => (
          <Screen isOpen={this.props.open} toggle={this.props.toggle}>
            <ScreenHeader toggle={this.props.toggle}>
              {t("Recuperar")}
            </ScreenHeader>
            <ScreenBody>
              <p />
              <div style={{ marginBottom: "1rem" }}>{t("pastePrivateKey")}</div>

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
                      context.setState({ pleaseWaitAlertOpen: true });
                      await context.restorePrivateKey(this.state.inputValue);
                      context.setState({ pleaseWaitAlertOpen: false });
                      window.location.reload();
                    } catch (e) {
                      console.error(e);
                      context.setState({
                        pleaseWaitAlertOpen: false,
                        failedRestoreAlertOpen: true
                      });
                      setTimeout(() => {
                        context.setState({ failedRestoreAlertOpen: false });
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
          </Screen>
        )}
      </Subscribe>
    );
  }
}

export default withI18n()(Recover);
