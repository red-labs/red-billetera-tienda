import React, { Component } from "react";
import logo from "./logo.svg";
import Send from "./Send";
import Receive from "./Receive";
import Save from "./Save";
import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter
} from "reactstrap";
import Web3 from "web3";
import { Account } from "web3-eth-accounts";
import { randomHex } from "./randomHex";
import Advanced from "./Advanced";
import { ImmortalDB } from "immortal-db";
//@ts-ignore
import baseEmoji from "base-emoji";
import { translate } from "react-i18next";

enum Route {
  Main,
  Send,
  Receive,
  Save,
  Advanced
}

interface Props {
  i18n: any
  t: Function
}

interface State {
  account?: Account;
  route: Route;
  web3: Web3;
  balance?: number;
}

class App extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    const web3 = new Web3("http://localhost:8545");

    this.state = {
      account: undefined,
      route: Route.Main,
      balance: undefined,
      web3
    };
  }

  async componentDidMount() {
    let privateKey = await ImmortalDB.get("efectivoPrivateKey");

    if (privateKey === null) {
      privateKey = this.state.web3.eth.accounts.create(randomHex(32))
        .privateKey;
      await ImmortalDB.set("efectivoPrivateKey", privateKey);
    }
    let account = this.state.web3.eth.accounts.privateKeyToAccount(privateKey)
    let balance = await this.getBalance(account.address)
    this.setState({
      account,
      balance
    });
  }

  async getBalance(address: string) {
    let balance = this.state.web3.utils.fromWei(await this.state.web3.eth.getBalance(address))
    return Number(balance)
  }

  addressToEmoji = (address: string) => {
    const hash = this.state.web3.utils.sha3(address);
    const last2bytes = hash.slice(-4);
    const buf = new Buffer(last2bytes, "hex");
    return baseEmoji.toUnicode(buf);
  };

  render() {
    let { i18n, t } = this.props
    let balance = !isNaN(Number(this.state.balance)) ? '$' + this.state.balance : t('loading')
    return this.state.account ? (
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100vh"
          }}
        >
          <h1>
            {this.state.account &&
              this.addressToEmoji(this.state.account.address)}{" "}
              {t('efectivo')}
          </h1>
          <h1>{balance}</h1>
          <div className="d-flex w-100 text-center justify-content-center">
            <Button 
              onClick={() => i18n.changeLanguage("en")}
              style={{ flex: "1 1 0", maxWidth: 200, margin: 5 }}
              size="lg"
            >English</Button>
            <Button 
              onClick={() => i18n.changeLanguage("es")}
              style={{ flex: "1 1 0", maxWidth: 200, margin: 5 }}
              size="lg"
            >Español</Button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center"
            }}
          >
            <Button
              onClick={() => this.setState({ route: Route.Send })}
              style={{ flex: "1 1 0", maxWidth: 200, margin: 5 }}
              size="lg"
            >
              {t('send')}
            </Button>
            <Button
              onClick={() => this.setState({ route: Route.Receive })}
              style={{ flex: "1 1 0", maxWidth: 200, margin: 5 }}
              size="lg"
            >
              {t('receive')}
            </Button>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center"
            }}
          >
            <Button
              onClick={() => this.setState({ route: Route.Save })}
              style={{ flex: "1 1 0", maxWidth: 410, margin: 5 }}
              size="lg"
            >
              {t('saveRestore')}
            </Button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center"
            }}
          >
            <Button
              outline
              onClick={() => this.setState({ route: Route.Advanced })}
              style={{ flex: "1 1 0", maxWidth: 410, margin: 5 }}
              size="sm"
            >
              {t('advanced')}
            </Button>
          </div>
        </div>
        <Send
          toggle={() => this.setState({ route: Route.Main })}
          open={this.state.route === Route.Send}
          web3={this.state.web3}
        />
        <Receive
          address={this.state.account.address}
          toggle={() => this.setState({ route: Route.Main })}
          open={this.state.route === Route.Receive}
        />
        <Save
          privateKey={this.state.account.privateKey}
          toggle={() => this.setState({ route: Route.Main })}
          open={this.state.route === Route.Save}
        />
        <Advanced
          toggle={() => this.setState({ route: Route.Main })}
          open={this.state.route === Route.Advanced}
          web3={this.state.web3}
        />
      </div>
    ) : (
      <div />
    );
  }
}

export default translate()(App as any);
