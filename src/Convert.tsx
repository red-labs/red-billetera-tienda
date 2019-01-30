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
import Web3 from "web3";

interface Props {
  open: boolean;
  toggle: () => void;
  currency: Currency;
  convertTo: Currency;
  web3: Web3;
}

interface State {}

class Convert extends Component<Props, State> {
  static defaultProps = {
    currency: Currency.XDAI,
    convertTo: Currency.XDAI
  };

  render() {
    return (
      <Modal isOpen={this.props.open} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>
          Convert {currencyToName(this.props.currency)} to{" "}
          {currencyToName(this.props.convertTo)}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="amountToSend">Convert</Label>
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
            <Label style={{ marginTop: 8 }}>
              to {currencyToName(this.props.convertTo)}
            </Label>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.props.toggle}>
            Convert
          </Button>{" "}
          <Button color="secondary" onClick={this.props.toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default Convert;
