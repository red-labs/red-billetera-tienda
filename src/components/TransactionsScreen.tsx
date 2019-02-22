import { ListGroup } from "reactstrap";
import React, { Component } from "react";
import { withI18n } from "react-i18next";
import { Transaction } from "../types";
import { AppContainer } from "../store";
import { Subscribe } from "unstated";
import { Screen, ScreenHeader, ScreenBody } from "./Screen";
import TransactionRow from "./TransactionRow";
import ListGroupItem from "reactstrap/lib/ListGroupItem";
import copy from "clipboard-copy";

interface Props {
  open: boolean;
  toggle: () => void;
  t: Function;
}

class Transactions extends Component<Props> {
  copy = (context: AppContainer, tx: Transaction) => {
    copy(
      tx.to.toLowerCase() === context.state.xDaiWallet.address.toLowerCase()
        ? tx.from
        : tx.to
    );

    context.setState({ addressCopiedAlertOpen: true });
    setTimeout(() => {
      context.setState({ addressCopiedAlertOpen: false });
    }, 10000);
  };

  render() {
    const { t } = this.props;
    return (
      <Subscribe to={[AppContainer]}>
        {(context: AppContainer) => (
          <Screen isOpen={this.props.open} toggle={this.props.toggle}>
            <ScreenHeader toggle={this.props.toggle}>
              {t("transactions")}
            </ScreenHeader>
            <ScreenBody>
              <ListGroup flush>
                {context.state.transactions
                  .sort((tx1, tx2) => tx2.timeStamp - tx1.timeStamp)
                  .map((tx: Transaction, i) => (
                    <div key={i}>
                      <TransactionRow
                        tx={tx}
                        address={context.state.xDaiWallet.address}
                      />
                      <ListGroupItem
                        style={{
                          padding: "0.5rem 0",
                          display: "flex",
                          justifyContent: "center"
                        }}
                        onClick={() => this.copy(context, tx)}
                      >
                        <small>
                          <span>
                            {tx.to.toLowerCase() ===
                            context.state.xDaiWallet.address.toLowerCase()
                              ? tx.from
                              : tx.to}
                          </span>
                        </small>
                      </ListGroupItem>
                    </div>
                  ))}
              </ListGroup>
            </ScreenBody>
          </Screen>
        )}
      </Subscribe>
    );
  }
}

export default withI18n()(Transactions);
