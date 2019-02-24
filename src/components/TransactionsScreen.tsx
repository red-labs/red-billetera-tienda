import { ListGroup, Alert } from "reactstrap";
import React, { Component } from "react";
import { withI18n } from "react-i18next";
import { Transaction } from "../types";
import { AppContainer } from "../store";
import { Subscribe } from "unstated";
import { Screen, ScreenHeader, ScreenBody } from "./Screen";
import TransactionRow from "./TransactionRow";
import copy from "clipboard-copy";
import ethers from "ethers";
import { addressToEmoji } from "../utils";

interface Props {
  open: boolean;
  toggle: () => void;
  t: Function;
}

interface State {
  emojiAddress: string;
}

class Transactions extends Component<Props, State> {
  state = {
    emojiAddress: ""
  };

  copy = (context: AppContainer, tx: Transaction) => {
    const counterParty =
      tx.to.toLowerCase() === context.state.xDaiWallet.address.toLowerCase()
        ? tx.from
        : tx.to;

    this.setState({ emojiAddress: addressToEmoji(counterParty) });
    copy(counterParty);

    context.setState({ addressCopiedEmojiAlertOpen: true });
    setTimeout(() => {
      context.setState({ addressCopiedEmojiAlertOpen: false });
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
                        onClick={() => this.copy(context, tx)}
                        address={context.state.xDaiWallet.address}
                      />
                    </div>
                  ))}
              </ListGroup>
            </ScreenBody>
            <div
              style={{
                position: "fixed",
                bottom: 10,
                left: 10,
                right: 10,
                display: "flex",
                justifyContent: "center",
                textAlign: "center"
              }}
            >
              <Alert
                style={{ width: 450 }}
                isOpen={context.state.addressCopiedEmojiAlertOpen}
                color="success"
                toggle={() =>
                  context.setState({ addressCopiedEmojiAlertOpen: false })
                }
              >
                {t("addressEmojiCopied", {
                  emoji: this.state.emojiAddress
                })}
              </Alert>
            </div>
          </Screen>
        )}
      </Subscribe>
    );
  }
}

export default withI18n()(Transactions);
