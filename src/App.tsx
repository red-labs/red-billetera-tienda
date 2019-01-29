import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
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

enum Route {
  Main,
  Send,
  Receive,
  Save,
  Advanced
}

function getOrGeneratePK() {
  let pk = localStorage.getItem("efectivoPrivateKey");

  if (pk === null) {
    pk = "0x583031d1113ad414f02576bd6afabfb302140225"; // TODO: generate private key
  }

  return pk;
}

interface Props {}

interface State {
  account: Account;
  route: Route;
  web3: Web3;
}

class App extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    const web3 = new Web3("http://localhost:8546");

    this.state = {
      account: web3.eth.accounts.create(randomHex(32)),
      route: Route.Main,
      web3
    };
  }

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            height: "100vh"
          }}
        >
          <h1>$3.00</h1>
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
              Send
            </Button>
            <Button
              onClick={() => this.setState({ route: Route.Receive })}
              style={{ flex: "1 1 0", maxWidth: 200, margin: 5 }}
              size="lg"
            >
              Receive
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
              Save / Restore
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
              Advanced
            </Button>
          </div>
        </div>
        <Send
          toggle={() => this.setState({ route: Route.Main })}
          open={this.state.route === Route.Send}
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
        />
      </div>
    );
  }
}

export default App;
