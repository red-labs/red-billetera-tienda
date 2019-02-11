import QrReader from "react-qr-reader";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import React, { Component } from "react";
import { withI18n } from "react-i18next";
import { Screen, ScreenHeader, ScreenBody } from "./Screen";

interface Props {
  open: boolean;
  toggle: () => void;
  onScan: (scanned: string | null) => void;
  t: Function;
}

interface State {}

class Send extends Component<Props, State> {
  render() {
    const { t } = this.props;

    return (
      <Screen isOpen={this.props.open} toggle={this.props.toggle}>
        <ScreenHeader toggle={this.props.toggle}>
          {t("scanAddress")}
        </ScreenHeader>
        <ScreenBody>
          <QrReader
            onScan={this.props.onScan}
            onError={err => console.log("error", err)}
          />
        </ScreenBody>
      </Screen>
    );
  }
}

export default withI18n()(Send);
