import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { upArrow, downArrow, rightArrow } from "../utils/icons";
import React, { Component } from "react";

import { Account } from "web3-eth-accounts";

import daiImg from "../images/dai.jpg";
import xdaiImg from "../images/xdai.jpg";
import ethImg from "../images/ethereum.png";

import { Currency } from "../types";
import Send from "./Send";
import Convert from "./Convert";
import Web3 from "web3";
import { withI18n } from "react-i18next";

interface Props {
  open: boolean;
  toggle: () => void;
  t: Function;
}

interface State {
  alertOpen: boolean;
  sendModal: {
    open: boolean;
    currency: Currency;
  };
  convertModal: {
    open: boolean;
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

function getConvertModalCurrency(state: State): Currency | undefined {
  return state.convertModal ? state.convertModal.currency : undefined;
}

function getConvertModalConvertTo(state: State): Currency | undefined {
  return state.convertModal ? state.convertModal.convertTo : undefined;
}

class Advanced extends Component<Props, State> {
  state = {
    alertOpen: false,
    sendModal: {
      open: false,
      currency: Currency.XDAI
    },
    convertModal: {
      open: false,
      currency: Currency.XDAI,
      convertTo: Currency.XDAI
    }
  };

  render() {
    const { t } = this.props;
    if (!this.props.open) {
      this.state.alertOpen = false;
    }
    return (
      <Modal isOpen={this.props.open} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>{t("advanced")}</ModalHeader>
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
                  this.setState({
                    sendModal: {
                      open: true,
                      currency: Currency.XDAI
                    }
                  })
                }
                size="lg"
                outline
                style={buttonStyle2}
              >
                <small style={buttonTextStyle}>
                  {t("send")} xDAI {rightArrow("#6c757d", 20, 20)}
                </small>
              </Button>
            </div>
            <div style={buttonBarStyle}>
              <Button
                onClick={() =>
                  this.setState({
                    convertModal: {
                      open: true,
                      currency: Currency.XDAI,
                      convertTo: Currency.DAI
                    }
                  })
                }
                style={buttonStyle}
                size="lg"
              >
                <small style={buttonTextStyle}>
                  {downArrow("#fff", 20, 20)} xDAI {t("to")} DAI
                </small>
              </Button>
              <Button
                onClick={() =>
                  this.setState({
                    convertModal: {
                      open: true,
                      currency: Currency.DAI,
                      convertTo: Currency.XDAI
                    }
                  })
                }
                style={buttonStyle}
                size="lg"
              >
                <small style={buttonTextStyle}>
                  {upArrow("#fff", 20, 20)} DAI {t("to")} xDAI
                </small>
              </Button>
            </div>
            <div style={balanceBarStyle}>
              <img width={30} src={daiImg} />
              <h5 style={balanceTextStyle}>$3.00</h5>
              <Button
                onClick={() =>
                  this.setState({
                    sendModal: { open: true, currency: Currency.DAI }
                  })
                }
                size="lg"
                outline
                style={buttonStyle2}
              >
                <small style={buttonTextStyle}>
                  {t("send")} DAI {rightArrow("#6c757d", 20, 20)}
                </small>
              </Button>
            </div>
            <div style={buttonBarStyle}>
              <Button
                onClick={() =>
                  this.setState({
                    convertModal: {
                      open: true,
                      currency: Currency.DAI,
                      convertTo: Currency.ETH
                    }
                  })
                }
                style={buttonStyle}
                size="lg"
              >
                <small style={buttonTextStyle}>
                  {downArrow("#fff", 20, 20)} DAI {t("to")} Eth
                </small>
              </Button>
              <Button
                onClick={() =>
                  this.setState({
                    convertModal: {
                      open: true,
                      currency: Currency.ETH,
                      convertTo: Currency.DAI
                    }
                  })
                }
                style={buttonStyle}
                size="lg"
              >
                <small style={buttonTextStyle}>
                  {upArrow("#fff", 20, 20)} Eth {t("to")} DAI
                </small>
              </Button>
            </div>
            <div style={balanceBarStyle}>
              <img width={30} src={ethImg} />
              <h5 style={balanceTextStyle}>$3.00</h5>
              <Button
                onClick={() =>
                  this.setState({
                    sendModal: { open: true, currency: Currency.ETH }
                  })
                }
                size="lg"
                outline
                style={buttonStyle2}
              >
                <small style={buttonTextStyle}>
                  {t("send")} Eth {rightArrow("#6c757d", 20, 20)}
                </small>
              </Button>
            </div>
          </div>
          <hr />
        </ModalBody>

        {this.state.convertModal !== undefined && (
          <Convert
            toggle={() =>
              this.setState({
                convertModal: { ...this.state.convertModal, open: false }
              })
            }
            open={this.state.convertModal.open}
            currency={this.state.convertModal.currency}
            convertTo={this.state.convertModal.convertTo}
          />
        )}
        <Send
          toggle={() =>
            this.setState({
              sendModal: {
                ...this.state.sendModal,
                open: false
              }
            })
          }
          open={this.state.sendModal.open}
          currency={Currency.XDAI}
        />
      </Modal>
    );
  }
}

export default withI18n()(Advanced);
