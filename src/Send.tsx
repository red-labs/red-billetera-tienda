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
  Label
} from "reactstrap";
import { qr, camera } from "./icons";
import React, { Component } from "react";
import { Currency, currencyToName, currencyToSymbol } from "./types";
import QrReader from "./QrReader";
import Web3 from "web3";

interface Props {
  open: boolean;
  toggle: () => void;
  currency: Currency;
  web3: Web3;
}

interface State {
  qrReading: boolean;
  address: string;
}

class Send extends Component<Props, State> {
  static defaultProps = {
    currency: Currency.XDAI
  };

  state = { qrReading: false, address: "" };
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
                  this.setState({ address: event.target.value });
                }}
                value={this.state.address}
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
              <Input name="amountToSend" id="amountToSend" placeholder="0.00" />
              <InputGroupAddon addonType="append">
                {currencyToName(this.props.currency)}
              </InputGroupAddon>
            </InputGroup>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.props.toggle}>
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
              this.setState({ qrReading: false, address: scanned });
            }
          }}
        />
      </Modal>
    );
  }
}

export default Send;
