import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Input,
  Alert,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  FormGroup,
  Label
} from "reactstrap";
import { copy as copyIcon } from "./icons";
import React, { Component } from "react";
import QRCode from "qrcode.react";
import copy from "clipboard-copy";

interface Props {
  open: boolean;
  toggle: () => void;
  privateKey: string;
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
    if (!this.props.open) {
      this.state.saveAlertOpen = false;
      this.state.restoreAlertOpen = false;
    }
    return (
      <Modal isOpen={this.props.open} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>Save / Restore</ModalHeader>
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
              {copyIcon("#fff")} Copy private key
            </Button>
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
              Restore private key
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
            Private key copied to clipboard
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
            Private key restored
          </Alert>
        </div>
      </Modal>
    );
  }
}

export default Save;
