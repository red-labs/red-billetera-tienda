import {
  Modal,
  ModalBody,
  ModalHeader,
  Table
} from "reactstrap";
import React, { Component } from "react";
import { withI18n } from "react-i18next";

interface Props {
  open: boolean;
  toggle: () => void;
  address: String;
  t: Function;
}

interface State {
  api: String;
  txns: String[];
}

class Transactions extends Component<Props, State> {
  state = {
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
    if (this.state.txns.length === 0) return t("noTransactions")
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
            {this.state.txns.map((tx, i) => {
              console.log('HEY', tx)
              // I did object assignment because i couldn't reference 
              // tx.transactionIndex:
              // Property 'transactionIndex' does not exist on type 'never'. [2339]
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