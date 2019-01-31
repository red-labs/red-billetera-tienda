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
import { translate } from "react-i18next";

interface Props {
  open: boolean;
  toggle: () => void;
  currency: Currency;
  convertTo: Currency;
  web3: Web3;
  t: Function;
}

interface State {}

class Convert extends Component<Props, State> {
  static defaultProps = {
    currency: Currency.XDAI,
    convertTo: Currency.XDAI
  };

  render() {
    const { t } = this.props

    return (
      <Modal isOpen={this.props.open} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>
          {t('convert')} {currencyToName(this.props.currency)} {t('to')}
          {currencyToName(this.props.convertTo)}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="amountToSend">{t('convert')}</Label>
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
              {t('to')} {currencyToName(this.props.convertTo)}
            </Label>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.props.toggle}>
            {t('convert')} 
          </Button>{" "}
          <Button color="secondary" onClick={this.props.toggle}>
            {t('cancel')} 
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default translate()(Convert as any) as any;
