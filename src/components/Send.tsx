import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Input,
  InputGroup,
  InputGroupAddon,
  FormGroup,
  Label
} from "reactstrap";
import { qr, camera } from "../utils/icons";
import React, { Component } from "react";
import { Currency, currencyToName, currencyToSymbol } from "../types";
import QrReader from "./QrReader";
import { withI18n } from "react-i18next";
import { isAddress } from "../utils/isAddress";
import { addressToEmoji } from "../utils/addressToEmoji";
import { AppContainer } from "../store";
import { Subscribe } from "unstated";
import { ethers } from "ethers";

interface Props {
  open: boolean;
  toggle: () => void;
  currency: Currency;
  t: Function;
}

interface State {
  qrReading: boolean;
  toAddress: string;
  amount?: string;
}

class Send extends Component<Props, State> {
  static defaultProps = {
    currency: Currency.XDAI
  };

  state = {
    qrReading: false,
    toAddress: "",
    txSendingAlert: undefined,
    txSuccessAlert: undefined,
    txErrorAlert: undefined,
    amount: undefined
  };

  render() {
    const { t } = this.props;

    return (
      <Subscribe to={[AppContainer]}>
        {(context: AppContainer) => (
          <Modal isOpen={this.props.open} toggle={this.props.toggle}>
            <ModalHeader toggle={this.props.toggle}>
              {t("send")} {currencyToName(this.props.currency)}
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="sendToAddress">{t("sendToAddress")}</Label>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center"
                  }}
                >
                  <Input
                    name="sendToAddress"
                    id="sendToAddress"
                    placeholder="0x..."
                    onChange={event => {
                      this.setState({ toAddress: event.target.value.trim() });
                    }}
                    value={this.state.toAddress}
                    style={{ flexGrow: 1, marginRight: 5 }}
                  />

                  <Button
                    onClick={() => this.setState({ qrReading: true })}
                    style={{ flexGrow: 1, marginLeft: 5 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center"
                      }}
                    >
                      {camera("#fff")}
                      {qr("#fff")}
                    </div>
                  </Button>
                </div>
              </FormGroup>
              <FormGroup>
                <Label for="amountToSend">{t("sendAmount")}</Label>
                <InputGroup>
                  {this.props.currency !== Currency.ETH && (
                    <InputGroupAddon addonType="prepend">
                      {currencyToSymbol(this.props.currency)}
                    </InputGroupAddon>
                  )}
                  <Input
                    name="amountToSend"
                    id="amountToSend"
                    placeholder="0.00"
                    type="number"
                    onChange={event => {
                      this.setState({
                        amount: event.target.value
                      });
                    }}
                    value={this.state.amount}
                  />
                  <InputGroupAddon addonType="append">
                    {currencyToName(this.props.currency)}
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
              {isAddress(this.state.toAddress) && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 20,
                    marginBottom: 15
                  }}
                >
                  <h5 style={{ marginRight: 10 }}>
                    Send {formatDaiAmount(this.state.amount)} to:
                  </h5>

                  <h1>
                    {addressToEmoji(
                      this.state.toAddress.substring(0, 2) === "0x"
                        ? this.state.toAddress
                        : "0x" + this.state.toAddress
                    )}
                  </h1>
                </div>
              )}
              <Button
                disabled={!isNonZeroNumber(this.state.amount)}
                size="lg"
                block
                onClick={() => {
                  if (!isNonZeroNumber(this.state.amount)) {
                    context.sendTx(
                      this.props.currency,
                      this.state.toAddress,
                      ethers.utils.parseEther(this.state.amount!)
                    );
                  }
                  this.props.toggle();
                }}
              >
                {t("send")}
              </Button>{" "}
            </ModalBody>
            <QrReader
              toggle={() => this.setState({ qrReading: false })}
              open={this.state.qrReading}
              onScan={(scanned: string | null) => {
                if (scanned && isAddress(scanned)) {
                  this.setState({ qrReading: false, toAddress: scanned });
                }
              }}
            />
          </Modal>
        )}
      </Subscribe>
    );
  }
}

function isNonZeroNumber(number?: string) {
  return !!(
    number &&
    !isNaN(number as any) &&
    ethers.utils.parseEther(number).toString() !== "0"
  );
}

function formatDaiAmount(amount?: string) {
  return (
    amount &&
    !isNaN(amount as any) &&
    ethers.utils.parseEther(amount).toString() !== "0" &&
    "$" +
      ethers.utils.commify(
        Math.round(
          parseFloat(
            ethers.utils.formatEther(ethers.utils.parseEther(amount))
          ) * 100
        ) / 100
      )
  );
}

export default withI18n()(Send);
