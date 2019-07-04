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

class Save extends Component<Props, State> {
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
              {t("Guardar")}
            </ScreenHeader>
            <ScreenBody>
              <div style={{ marginBottom: "1rem" }}>
                {t("privateKeySecurity")}
              </div>
              <FormGroup>
                <Input
                  name="copyPrivateKey"
                  id="copyPrivateKey"
                  readOnly
                  placeholder="0x..."
                  value={context.state.xDaiWallet.privateKey}
                />
              </FormGroup>
              <Button
                onClick={() => this.copy(context)}
                block
                size="lg"
                style={{ marginBottom: "1rem" }}
              >
                {copyIcon("#fff")} {t("copyPrivateKey")}
              </Button>

              <p />




            </ScreenBody>
          </Screen>
        )}
      </Subscribe>
    );
  }
}

export default withI18n()(Save);
