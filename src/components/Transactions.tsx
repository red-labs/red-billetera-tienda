import { Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import React, { Component } from "react";
import { withI18n } from "react-i18next";
import { iTxn } from "../types";

interface Props {
  open: boolean;
  toggle: () => void;
  t: Function;
  txns: iTxn[];
}

class Transactions extends Component<Props> {
  renderTable() {
    const { t, txns } = this.props;
    if (txns.length === 0) return t("noTransactions");
    return (
      <div>
        <Table>
          <thead>
            <tr>
              <th>{t("date")}</th>
              <th>{t("amount")}</th>
              <th>{t("hash")}</th>
              <th>{t("to")}</th>
              <th>{t("pending")}</th>
            </tr>
          </thead>
          <tbody>
            {txns.map((tx: iTxn, i) => {
              return (
                <tr key={i}>
                  <th scope="row">{tx.nonce.toString()}</th>
                  <td>{tx.timeStamp.toString()}</td>
                  <td>{tx.value.toString()}</td>
                  <td>{tx.hash}</td>
                  <td>{tx.to}</td>
                  <td>{tx.txreceipt_status}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
  render() {
    const { t } = this.props;
    return (
      <Modal isOpen={this.props.open} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>
          {t("transactions")}
        </ModalHeader>
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
