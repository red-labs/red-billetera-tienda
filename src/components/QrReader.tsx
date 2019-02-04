import QrReader from "react-qr-reader";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import React, { Component } from "react";
import { withI18n } from "react-i18next";

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
      <Modal isOpen={this.props.open} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>{t("scanAddress")}</ModalHeader>
        <ModalBody>
          <QrReader
            onScan={this.props.onScan}
            onError={err => console.log("error", err)}
          />
        </ModalBody>
      </Modal>
    );
  }
}

export default withI18n()(Send);
