import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Input,
  Alert
} from "reactstrap";
import { copy as copyIcon } from "../utils/icons";
import React, { Component } from "react";
import copy from "clipboard-copy";
import { withI18n } from "react-i18next";
import ethers, { providers } from "ethers";

interface Props {
  open: boolean;
  toggle: () => void;
  address: String;
  t: Function;
  provider: providers.Provider
}

interface State {
  saveAlertOpen: boolean;
  restoreAlertOpen: boolean;
  api: String;
  txns: String[];
}

class Transactions extends Component<Props, State> {
  state = {
    saveAlertOpen: false,
    restoreAlertOpen: false,
    api: `https://blockscout.com/poa/dai/api?module=account&action=txlist&address=`,
    txns: [],
  };
  
  componentDidMount() {
    fetch(this.state.api + this.props.address)
    .then(res => res.json())
    .then(response => {
      if(response.message === "OK")
        this.setState({txns: response.result});
    })
  };

  render() {
    const { t } = this.props;
    return (
      <Modal isOpen={this.props.open} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>{t("transactions")}</ModalHeader>
        <ModalBody>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column"
            }}
          >
            {this.state.txns.length !== 0 ? this.state.txns : t("noTransactions")}
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default withI18n()(Transactions);