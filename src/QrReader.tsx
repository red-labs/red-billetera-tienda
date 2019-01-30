import QrReader from "react-qr-reader";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import React, { Component } from "react";

interface Props {
  open: boolean;
  toggle: () => void;
  onScan: (scanned: string | null) => void;
}

interface State {}

class Send extends Component<Props, State> {
  render() {
    return (
      <Modal isOpen={this.props.open} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>Scan address</ModalHeader>
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

export default Send;
