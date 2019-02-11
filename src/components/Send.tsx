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
import { Screen, ScreenHeader, ScreenBody } from "./Screen";
import { withI18n } from "react-i18next";
import {
  cleanAddress,
  addressToEmoji,
  isNonZeroNumber,
  formatDaiAmount
} from "../utils";
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
          <Screen isOpen={this.props.open} toggle={this.props.toggle}>
            <ScreenHeader toggle={this.props.toggle}>
              {t("send")} {currencyToName(this.props.currency)}
            </ScreenHeader>
            <ScreenBody>
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
              {cleanAddress(this.state.toAddress) && (
                <>
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
                      Send{" "}
                      {this.state.amount &&
                        !isNaN(this.state.amount as any) &&
                        ethers.utils
                          .parseEther(this.state.amount!)
                          .toString() !== "0" &&
                        formatDaiAmount(
                          ethers.utils.parseEther(this.state.amount!)
                        )}{" "}
                      to:
                    </h5>

                    <h1>
                      {addressToEmoji(cleanAddress(this.state.toAddress)!)}
                    </h1>
                  </div>
                  <Button
                    size="lg"
                    block
                    onClick={() => {
                      console.log(
                        this.state,
                        isNonZeroNumber(this.state.amount),
                        cleanAddress(this.state.toAddress)
                      );

                      const address = cleanAddress(this.state.toAddress);

                      if (isNonZeroNumber(this.state.amount) && address) {
                        context.sendTx(
                          this.props.currency,
                          address,
                          ethers.utils.parseEther(this.state.amount!)
                        );
                      }
                      this.props.toggle();
                    }}
                  >
                    {t("send")}
                  </Button>
                </>
              )}
            </ScreenBody>
            <QrReader
              toggle={() => this.setState({ qrReading: false })}
              open={this.state.qrReading}
              onScan={(scanned: string | null) => {
                if (scanned && cleanAddress(scanned)) {
                  this.setState({ qrReading: false, toAddress: scanned });
                }
              }}
            />
          </Screen>
        )}
      </Subscribe>
    );
  }
}

export default withI18n()(Send);
