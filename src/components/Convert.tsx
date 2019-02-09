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
import React, { Component } from "react";
import { Currency, currencyToName, currencyToSymbol } from "../types";
import { withI18n } from "react-i18next";
import { Screen, ScreenHeader, ScreenBody } from "./Screen";
interface Props {
  open: boolean;
  toggle: () => void;
  currency: Currency;
  convertTo: Currency;
  t: Function;
}

interface State {}

class Convert extends Component<Props, State> {
  static defaultProps = {
    currency: Currency.XDAI,
    convertTo: Currency.XDAI
  };

  render() {
    const { t } = this.props;

    return (
      <Screen isOpen={this.props.open} toggle={this.props.toggle}>
        <ScreenHeader toggle={this.props.toggle}>
          {t("convert")} {currencyToName(this.props.currency)} {t("to")}
          {currencyToName(this.props.convertTo)}
        </ScreenHeader>
        <ScreenBody>
          <FormGroup>
            <Label for="amountToSend">{t("convert")}</Label>
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
              {t("to")} {currencyToName(this.props.convertTo)}
            </Label>
          </FormGroup>
        </ScreenBody>
      </Screen>
    );
  }
}

export default withI18n()(Convert);
