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
import { distanceInWordsStrict } from "date-fns";

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
            <ScreenHeader toggle={this.props.toggle}>Transactions</ScreenHeader>
            <ScreenBody>
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
                      <small>
                        {tx.to.toLowerCase() ===
                        context.state.xDaiWallet.address.toLowerCase() ? (
                          <>
                            Received {formatDaiAmount(tx.value) + " "}
                            <span style={{ whiteSpace: "nowrap" }}>
                              from {addressToEmoji(tx.from)}
                            </span>
                          </>
                        ) : (
                          <>
                            Sent {formatDaiAmount(tx.value) + " "}
                            <span style={{ whiteSpace: "nowrap" }}>
                              to {addressToEmoji(tx.to)}
                            </span>
                          </>
                        )}
                      </small>
                      <small>
                        {distanceInWordsStrict(
                          new Date(),
                          new Date(tx.timeStamp * 1000)
                        )}{" "}
                        ago
                      </small>
                    </ListGroupItem>
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
