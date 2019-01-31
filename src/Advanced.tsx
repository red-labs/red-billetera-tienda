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

import { Currency } from "./types";
import Send from "./Send";
import Convert from "./Convert";
import Web3 from "web3";
import { translate } from "react-i18next";

interface Props {
  open: boolean;
  toggle: () => void;
  web3: Web3;
  t: Function;
}

interface State {
  alertOpen: boolean;
  sendModal?: {
    currency: Currency;
  };
  convertModal?: {
    currency: Currency;
    convertTo: Currency;
  };
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

function getSendModalCurrency(state: State): Currency | undefined {
  return state.sendModal ? state.sendModal.currency : undefined;
}

function getConvertModalCurrency(state: State): Currency | undefined {
  return state.convertModal ? state.convertModal.currency : undefined;
}

function getConvertModalConvertTo(state: State): Currency | undefined {
  return state.convertModal ? state.convertModal.convertTo : undefined;
}

class Advanced extends Component<Props, State> {
  state = {
    alertOpen: false,
    sendModal: undefined,
    convertModal: undefined
  };

  render() {
    const { t } = this.props
    if (!this.props.open) {
      this.state.alertOpen = false;
    }
    return (
      <Modal isOpen={this.props.open} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>{t('advanced')}</ModalHeader>
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
              <Button
                onClick={() =>
                  this.setState({ sendModal: { currency: Currency.XDAI } })
                }
                size="lg"
                outline
                style={buttonStyle2}
              >
                <small style={buttonTextStyle}>
                  {t('send')} xDAI {rightArrow("#6c757d", 20, 20)}
                </small>
              </Button>
            </div>
            <div style={buttonBarStyle}>
              <Button
                onClick={() =>
                  this.setState({
                    convertModal: {
                      currency: Currency.XDAI,
                      convertTo: Currency.DAI
                    }
                  })
                }
                style={buttonStyle}
                size="lg"
              >
                <small style={buttonTextStyle}>
                  {downArrow("#fff", 20, 20)} xDAI {t('to')} DAI
                </small>
              </Button>
              <Button
                onClick={() =>
                  this.setState({
                    convertModal: {
                      currency: Currency.DAI,
                      convertTo: Currency.XDAI
                    }
                  })
                }
                style={buttonStyle}
                size="lg"
              >
                <small style={buttonTextStyle}>
                  {upArrow("#fff", 20, 20)} DAI {t('to')} xDAI
                </small>
              </Button>
            </div>
            <div style={balanceBarStyle}>
              <img width={30} src={daiImg} />
              <h5 style={balanceTextStyle}>$3.00</h5>
              <Button
                onClick={() =>
                  this.setState({ sendModal: { currency: Currency.DAI } })
                }
                size="lg"
                outline
                style={buttonStyle2}
              >
                <small style={buttonTextStyle}>
                  {t('send')} DAI {rightArrow("#6c757d", 20, 20)}
                </small>
              </Button>
            </div>
            <div style={buttonBarStyle}>
              <Button
                onClick={() =>
                  this.setState({
                    convertModal: {
                      currency: Currency.DAI,
                      convertTo: Currency.ETH
                    }
                  })
                }
                style={buttonStyle}
                size="lg"
              >
                <small style={buttonTextStyle}>
                  {downArrow("#fff", 20, 20)} DAI {t('to')} Eth
                </small>
              </Button>
              <Button
                onClick={() =>
                  this.setState({
                    convertModal: {
                      currency: Currency.ETH,
                      convertTo: Currency.DAI
                    }
                  })
                }
                style={buttonStyle}
                size="lg"
              >
                <small style={buttonTextStyle}>
                  {upArrow("#fff", 20, 20)} Eth {t('to')} DAI
                </small>
              </Button>
            </div>
            <div style={balanceBarStyle}>
              <img width={30} src={ethImg} />
              <h5 style={balanceTextStyle}>$3.00</h5>
              <Button
                onClick={() =>
                  this.setState({ sendModal: { currency: Currency.ETH } })
                }
                size="lg"
                outline
                style={buttonStyle2}
              >
                <small style={buttonTextStyle}>
                  {t('send')} Eth {rightArrow("#6c757d", 20, 20)}
                </small>
              </Button>
            </div>
          </div>
          <hr />
        </ModalBody>

        <Convert
          toggle={() => this.setState({ convertModal: undefined })}
          open={this.state.convertModal !== undefined}
          currency={getConvertModalCurrency(this.state)}
          convertTo={getConvertModalConvertTo(this.state)}
          web3={this.props.web3}
        />
        <Send
          toggle={() => this.setState({ sendModal: undefined })}
          open={this.state.sendModal !== undefined}
          currency={getSendModalCurrency(this.state)}
          web3={this.props.web3}
        />
      </Modal>
    );
  }
}

export default translate()(Advanced as any) as any;
