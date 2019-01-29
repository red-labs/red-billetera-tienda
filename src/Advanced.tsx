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
import { upArrow, downArrow, rightArrow } from "./icons";
import React, { Component } from "react";
import QRCode from "qrcode.react";
import copy from "clipboard-copy";

import daiImg from "./images/dai.jpg";
import xdaiImg from "./images/xdai.jpg";
import ethImg from "./images/ethereum.png";

interface Props {
  open: boolean;
  toggle: () => void;
}

interface State {
  alertOpen: boolean;
}

const exchangeItemStyle = {
  marginBottom: 25
};

const buttonBarStyle = {
  display: "flex",
  justifyContent: "center",
  ...exchangeItemStyle
};

const balanceBarStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap" as "wrap",
  ...exchangeItemStyle
};

const buttonTextStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const balanceTextStyle = {
  flex: 1,
  textAlign: "center" as "center",
  marginBottom: 0
};

const buttonStyle = { flex: "1 1 0", maxWidth: 200, margin: 5 };
const buttonStyle2 = {
  flex: "1 1 0",
  maxWidth: 140,
  marginTop: 5
};

class Advanced extends Component<Props, State> {
  state = {
    alertOpen: false
  };

  render() {
    if (!this.props.open) {
      this.state.alertOpen = false;
    }
    return (
      <Modal isOpen={this.props.open} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>Advanced</ModalHeader>
        <ModalBody>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div style={balanceBarStyle}>
              <img width={30} src={xdaiImg} />
              <h5 style={balanceTextStyle}>$3.00</h5>
              <Button size="lg" outline style={buttonStyle2}>
                <small style={buttonTextStyle}>
                  Send xDAI {rightArrow("#6c757d", 20, 20)}
                </small>
              </Button>
            </div>
            <div style={buttonBarStyle}>
              <Button style={buttonStyle} size="lg">
                <small style={buttonTextStyle}>
                  {downArrow("#fff", 20, 20)} xDAI to DAI
                </small>
              </Button>
              <Button style={buttonStyle} size="lg">
                <small style={buttonTextStyle}>
                  {upArrow("#fff", 20, 20)} DAI to xDAI
                </small>
              </Button>
            </div>
            <div style={balanceBarStyle}>
              <img width={30} src={daiImg} />
              <h5 style={balanceTextStyle}>$3.00</h5>
              <Button size="lg" outline style={buttonStyle2}>
                <small style={buttonTextStyle}>
                  Send DAI {rightArrow("#6c757d", 20, 20)}
                </small>
              </Button>
            </div>
            <div style={buttonBarStyle}>
              <Button style={buttonStyle} size="lg">
                <small style={buttonTextStyle}>
                  {downArrow("#fff", 20, 20)} DAI to ETH
                </small>
              </Button>
              <Button style={buttonStyle} size="lg">
                <small style={buttonTextStyle}>
                  {upArrow("#fff", 20, 20)} ETH to DAI
                </small>
              </Button>
            </div>
            <div style={balanceBarStyle}>
              <img width={30} src={ethImg} />
              <h5 style={balanceTextStyle}>$3.00</h5>
              <Button size="lg" outline style={buttonStyle2}>
                <small style={buttonTextStyle}>
                  Send ETH {rightArrow("#6c757d", 20, 20)}
                </small>
              </Button>
            </div>
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
            Address copied to clipboard
          </Alert>
        </div>
      </Modal>
    );
  }
}

export default Advanced;
