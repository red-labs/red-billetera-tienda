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
import { translate } from "react-i18next";

interface Props {
  open: boolean;
  toggle: () => void;
  address: string;
  t: Function;
}

interface State {
  alertOpen: boolean;
}

class Receive extends Component<Props, State> {
  state = {
    alertOpen: false
  };

  copy = () => {
    copy(this.props.address);
    this.setState({ alertOpen: true });
    setTimeout(() => {
      this.setState({ alertOpen: false });
    }, 10000);
  };

  render() {
    const { t } = this.props
    if (!this.props.open) {
      this.state.alertOpen = false;
    }
    return (
      <Modal isOpen={this.props.open} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>{t('receive')}</ModalHeader>
        <ModalBody>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column"
            }}
          >
            <QRCode size={240} renderAs="svg" value={this.props.address} />

            <Input
              style={{ width: 240, marginTop: 10, marginBottom: 10 }}
              value={this.props.address}
            />
            <Button
              onClick={this.copy}
              block
              style={{ maxWidth: 240, margin: 5 }}
              size="lg"
            >
              {copyIcon("#fff")} Copy address
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
            isOpen={this.state.alertOpen}
            color="success"
            toggle={() => this.setState({ alertOpen: false })}
          >
            {t('addressCopied')}
          </Alert>
        </div>
      </Modal>
    );
  }
}

export default (translate()(Receive as any)) as any;
