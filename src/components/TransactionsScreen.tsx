import { ListGroup } from "reactstrap";
import React, { Component } from "react";
import { withI18n } from "react-i18next";
import { Transaction } from "../types";
import { AppContainer } from "../store";
import { Subscribe } from "unstated";
import { Screen, ScreenHeader, ScreenBody } from "./Screen";
import { addressToEmoji, formatDaiAmount } from "../utils";
import { distanceInWordsStrict } from "date-fns";
import TransactionRow from "./TransactionRow";

interface Props {
  open: boolean;
  toggle: () => void;
  t: Function;
}

class Transactions extends Component<Props> {
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
                    <TransactionRow
                      tx={tx}
                      address={context.state.xDaiWallet.address}
                    />
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
