import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Input,
  Alert,
  Table
} from "reactstrap";
import { copy as copyIcon } from "../utils/icons";
import React, { Component } from "react";
import copy from "clipboard-copy";
import { withI18n } from "react-i18next";

interface Props {
  open: boolean;
  toggle: () => void;
  address: String;
  t: Function;
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

  renderTable() {
    const {t} = this.props
    let { txns } = this.state
    console.log('TXNS', txns)
    if (txns.length === 0) return t("noTransactions")
    return(
      <div>
      <Table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Hash</th>
            <th>To</th>
          </tr>
        </thead>
        <tbody>
          {txns.map((tx, i) => {
            console.log('HEY', tx)
            let {
              transactionIndex = 0,
              timestamp = 0,
              value = 0,
              hash = '',
              to = '',
            } = tx
            return(
              <tr key={i}>
                <th scope="row">{transactionIndex}</th>
                <td>{timestamp}</td>
                <td>{value}</td>
                <td>{hash}</td>
                <td>{to}</td>
              </tr>
            )
            })
          }
        </tbody>
      </Table>
      </div>
    )
  }
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
            {this.renderTable()}
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default withI18n()(Transactions);