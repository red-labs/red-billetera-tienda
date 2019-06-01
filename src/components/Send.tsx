import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  FormGroup,
  Label,
  Row,
  Col
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
  convertToCOP,
  convertFromCOP,
  formatToDollars,
  toWei
} from "../utils";
import { AppContainer } from "../store";
import { Subscribe } from "unstated";
import { formatEther, BigNumber, parseEther } from "ethers/utils";
import i18n from "i18next";

interface Props {
  open: boolean;
  toggle: () => void;
  currency: Currency;
  t: Function;
}

interface State {
  qrReading: boolean;
  toAddress: string;
  amount: string;
}

class Send extends Component<Props, State> {
  static defaultProps = {
    currency: Currency.XDAI
  };

  state = {
    qrReading: false,
    toAddress: "",
    amount: ""
  };

  transactionDetails = (t: Function, foreignCurrencyRate?: BigNumber) => {
    if (this.state.amount === "") {
      return <div />;
    }
    let amount = parseEther(this.state.amount);

    return (
      <Row
        style={{
          justifyContent: "center",
          marginTop: 20,
          marginBottom: 15
        }}
      >
        <div style={{ margin: 5 }}>{t("to")}</div>
        <div style={{ fontSize: "1.6em" }}>
          {addressToEmoji(cleanAddress(this.state.toAddress)!)}
        </div>
      </Row>
    );
  };

  render() {
    const { t } = this.props;

    return (
      <Subscribe to={[AppContainer]}>
        {(context: AppContainer) => (
          <Screen isOpen={this.props.open} toggle={this.props.toggle}>
            <ScreenHeader toggle={this.props.toggle}>{t("send")}</ScreenHeader>
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
                {i18n.language === "es" && context.state.usdcop ? (
                  <div style={{ textAlign: "right" }}>
                    ($
                    {formatToDollars(
                      convertFromCOP(this.state.amount, context.state.usdcop),
                      false
                    )}
                    <small> USD</small>)
                  </div>
                ) : (
                  <></>
                )}
              </FormGroup>
              {cleanAddress(this.state.toAddress) && (
                <>
                  {this.transactionDetails(t, context.state.usdcop)}
                  <Button
                    size="lg"
                    block
                    onClick={async () => {
                      const address = cleanAddress(this.state.toAddress);

                      if (
                        isNonZeroNumber(this.state.amount) &&
                        address &&
                        // Only check for the exchange rate if the language is
                        // Spanish
                        (this.props.currency === Currency.COP
                          ? context.state.usdcop
                          : true)
                      ) {
                        context.setState({ txSendingAlert: true });

                        const amountToSend =
                          this.props.currency === Currency.COP &&
                          context.state.usdcop // checking for usdcop just to make typescript happy
                            ? parseEther(
                                convertFromCOP(
                                  this.state.amount,
                                  context.state.usdcop
                                ).toString()
                              )
                            : parseEther(this.state.amount);

                        try {
                          let txn = await context.sendTx(
                            this.props.currency,
                            address,
                            amountToSend
                          );
                          if (txn.hash) {
                            context.state.xDaiProvider.once(txn.hash, () => {
                              context.setState({
                                txSendingAlert: false,
                                txSuccessAlert: true
                              });
                              setTimeout(() => {
                                context.setState({ txSuccessAlert: false });
                              }, 10000);
                            });
                          }
                        } catch (e) {
                          context.setState({
                            txSendingAlert: false,
                            txErrorAlert: true
                          });
                          setTimeout(() => {
                            context.setState({ txErrorAlert: false });
                          }, 10000);
                        }
                        this.props.toggle();
                      }
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
