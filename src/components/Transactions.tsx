import {
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  Table,
  ListGroup,
  ListGroupItem
} from "reactstrap";
import React, { Component } from "react";
import { withI18n } from "react-i18next";
import { Transaction } from "../types";
import { AppContainer } from "../store";
import { Subscribe } from "unstated";
import { Screen, ScreenHeader, ScreenBody } from "./Screen";
import { addressToEmoji, formatDaiAmount } from "../utils";

interface Props {
  open: boolean;
  toggle: () => void;
  t: Function;
}

class Transactions extends Component<Props> {
  renderTable(txns: Transaction[]) {
    const { t } = this.props;
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
            {txns.map((tx: Transaction, i) => {
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
      <Subscribe to={[AppContainer]}>
        {(context: AppContainer) => (
          <div
            style={{
              position: "relative",
              maxHeight: "30vh",
              overflow: "hidden"
            }}
          >
            <ListGroup flush>
              {context.state.transactions
                .sort((tx1, tx2) => tx2.timeStamp - tx1.timeStamp)
                .map((tx: Transaction, i) => (
                  <ListGroupItem
                    style={{
                      padding: "0.5rem 0",
                      display: "flex",
                      justifyContent: "space-between"
                    }}
                  >
                    <div>
                      {tx.to === context.state.xDaiWallet.address ? (
                        `Received ${formatDaiAmount(
                          tx.value
                        )} from ${addressToEmoji(tx.from)}`
                      ) : (
                        <>
                          Sent {formatDaiAmount(tx.value)} to{" "}
                          <span style={{ whiteSpace: "nowrap" }}>
                            {addressToEmoji(tx.to)}
                          </span>
                        </>
                      )}
                    </div>
                    <div>less than a minute ago</div>
                  </ListGroupItem>
                ))}
            </ListGroup>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                height: "5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(255,255,255,.7) 40%,rgba(255,255,255,1) 55%)"
              }}
            >
              <Button color="link">See all transactions</Button>
            </div>
          </div>
        )}
      </Subscribe>
    );
  }
}

export default withI18n()(Transactions);
