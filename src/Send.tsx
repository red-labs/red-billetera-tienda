import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Input,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  FormGroup,
  Label,
  Alert
} from "reactstrap";
import { qr, camera } from "./icons";
import React, { Component } from "react";
import { Currency, currencyToName, currencyToSymbol } from "./types";
import QrReader from "./QrReader";
import Web3 from "web3";
import { Accounts, Account } from "web3-eth-accounts/types";

interface Props {
  open: boolean;
  toggle: () => void;
  currency: Currency;
  web3: Web3;
  account: Account;
}

interface State {
  qrReading: boolean;
  toAddress: string;
  amount: number;
  txSendingAlert?: {
    toAddress: string;
    amount: number;
  };
  txErrorAlert?: {
    toAddress: string;
    amount: number;
  };
  txSuccessAlert?: {
    toAddress: string;
    amount: number;
  };
}

function TxSendingAlert(props: {
  txSendingAlert?: {
    toAddress: string;
    amount: number;
  };
  isOpen: boolean;
  toggle: () => void;
}) {
  return (
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
        isOpen={props.isOpen}
        color="info"
        toggle={props.toggle}
      >
        {props.txSendingAlert &&
          "Sending " +
            props.txSendingAlert.amount +
            " to " +
            props.txSendingAlert.toAddress +
            ". Please wait a moment."}
      </Alert>
    </div>
  );
}

function TxErrorAlert(props: {
  txErrorAlert?: {
    toAddress: string;
    amount: number;
  };
  isOpen: boolean;
  toggle: () => void;
}) {
  return (
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
        isOpen={props.isOpen}
        color="info"
        toggle={props.toggle}
      >
        {props.txErrorAlert &&
          "Error sending " +
            props.txErrorAlert.amount +
            " to " +
            props.txErrorAlert.toAddress +
            ". Please try again later. "}
      </Alert>
    </div>
  );
}

function TxSuccessAlert(props: {
  txSuccessAlert?: {
    toAddress: string;
    amount: number;
  };
  isOpen: boolean;
  toggle: () => void;
}) {
  return (
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
        isOpen={props.isOpen}
        color="info"
        toggle={props.toggle}
      >
        {props.txSuccessAlert &&
          "Sent " +
            props.txSuccessAlert.amount +
            " to " +
            props.txSuccessAlert.toAddress}
      </Alert>
    </div>
  );
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
    amount: 0
  };

  sendTx = () => {
    this.props.web3.eth
      .sendTransaction({
        from: this.props.account.address,
        to: this.state.toAddress,
        value: this.state.amount
      })
      .on("transactionHash", () => {
        this.setState({
          txSendingAlert: {
            toAddress: this.state.toAddress,
            amount: this.state.amount
          }
        });
      })
      .on("error", err => {
        this.setState({
          txSendingAlert: undefined,
          txErrorAlert: {
            toAddress: this.state.toAddress,
            amount: this.state.amount
          }
        });
      })
      .on("receipt", err => {
        this.setState({
          txSendingAlert: undefined,
          txSuccessAlert: {
            toAddress: this.state.toAddress,
            amount: this.state.amount
          }
        });
      });
  };

  render() {
    return (
      <Modal isOpen={this.props.open} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>
          Send {currencyToName(this.props.currency)}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="sendToAddress">Send to address</Label>
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
                  this.setState({ toAddress: event.target.value });
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
            <Label for="amountToSend">Send amount</Label>
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
                onChange={event => {
                  this.setState({
                    amount: (event.target.value as any) as number
                  });
                }}
                value={this.state.amount}
              />
              <InputGroupAddon addonType="append">
                {currencyToName(this.props.currency)}
              </InputGroupAddon>
            </InputGroup>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.sendTx}>
            Send
          </Button>{" "}
          <Button color="secondary" onClick={this.props.toggle}>
            Cancel
          </Button>
        </ModalFooter>
        <QrReader
          toggle={() => this.setState({ qrReading: false })}
          open={this.state.qrReading}
          onScan={scanned => {
            if (scanned && this.props.web3.utils.isAddress(scanned)) {
              this.setState({ qrReading: false, toAddress: scanned });
            }
          }}
        />
        <TxSendingAlert
          toggle={() => this.setState({ txSendingAlert: undefined })}
          isOpen={this.state.txSendingAlert !== undefined}
          txSendingAlert={this.state.txSendingAlert}
        />
        <TxSuccessAlert
          toggle={() => this.setState({ txSuccessAlert: undefined })}
          isOpen={this.state.txSuccessAlert !== undefined}
          txSuccessAlert={this.state.txSuccessAlert}
        />
        <TxErrorAlert
          toggle={() => this.setState({ txErrorAlert: undefined })}
          isOpen={this.state.txErrorAlert !== undefined}
          txErrorAlert={this.state.txErrorAlert}
        />
      </Modal>
    );
  }
}

export default Send;
