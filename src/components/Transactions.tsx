import { Button, ListGroup, ListGroupItem } from "reactstrap";
import React, { Component } from "react";
import { withI18n } from "react-i18next";
import { Transaction } from "../types";
import { AppContainer } from "../store";
import { Subscribe } from "unstated";
import TransactionRow from "./TransactionRow";

interface Props {
  viewTransactions: () => void;
  t: Function;
}

class Transactions extends Component<Props> {
  render() {
    const { t } = this.props;
    return (
      <Subscribe to={[AppContainer]}>
        {(context: AppContainer) =>
          context.state.transactions.length > 0 && (
            <div
              style={{
                position: "relative",
                height: "30vh",
                overflow: "hidden"
              }}
            >
              <ListGroup flush>
                {context.state.transactions
                  .sort((tx1, tx2) => tx2.timeStamp - tx1.timeStamp)
                  .map((tx: Transaction, i) => (
                    <TransactionRow
                      tx={tx}
                      onClick={() => null}
                      address={context.state.xDaiWallet.address}
                      key={i}
                    />
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
                <Button onClick={this.props.viewTransactions} color="link">
                  {t("allTransactions")}
                </Button>
              </div>
            </div>
          )
        }
      </Subscribe>
    );
  }
}

export default withI18n()(Transactions);
