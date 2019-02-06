import { ethers } from "ethers";
import { Currency, Transaction } from "../types";
import { Container } from "unstated";

// This is a simplified ABI that only has the functions
// that the app might care about.
import ERC20Abi from "../utils/ERC20.json"

export enum Route {
  Main,
  Send,
  Receive,
  Save,
  Advanced,
  Transactions
}

export interface RootState {
  currency: Currency;
  route: Route;
  xDaiProvider: ethers.providers.Provider;
  ethProvider: ethers.providers.Provider;
  xDaiWallet: ethers.Wallet;
  ethWallet: ethers.Wallet;
  xDaiBalance?: ethers.utils.BigNumber;
  daiBalance?: ethers.utils.BigNumber;
  ethBalance?: ethers.utils.BigNumber;
  transactions: Transaction[];
}

const DAI = "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359"

export class AppContainer extends Container<RootState> {
  constructor() {
    super();
    let privateKey = localStorage.getItem("efectivoPrivateKey");

    if (privateKey === null) {
      privateKey = ethers.Wallet.createRandom().privateKey;
      localStorage.setItem("efectivoPrivateKey", privateKey);
    }
    const xDaiProvider = new ethers.providers.JsonRpcProvider(
      "http://localhost:3000"
    );
    const ethProvider = ethers.getDefaultProvider();
    const xDaiWallet = new ethers.Wallet(privateKey, xDaiProvider);
    const ethWallet = new ethers.Wallet(privateKey, ethProvider);

    // This initialization is probably not needed or can be avoided
    // Right now this has a lenght of 1 but when componentDidMount
    // is called on App.tsx ir sets this state var to an empty
    // array
    let transactions: Transaction[] = [
    ]

    this.state = {
      currency: Currency.XDAI,
      route: Route.Main,
      xDaiProvider,
      ethProvider,
      xDaiWallet,
      ethWallet,
      transactions,
    };
  }

  sendTx = async (
    currency: Currency,
    toAddress: string,
    amount: ethers.utils.BigNumber
  ) => {
    let wallet: ethers.Wallet;
    switch (currency) {
      case Currency.DAI:
      case Currency.ETH:
        wallet = this.state.ethWallet;
        break;
      default:
        wallet = this.state.xDaiWallet;
        break;
    }

    await wallet.sendTransaction({
      to: toAddress,
      value: amount
    });
  };

  setRoute = (route: Route) => {
    this.setState({ route });
  };

  setXDaiBalance = (xDaiBalance: ethers.utils.BigNumber) => {
    this.setState({ xDaiBalance });
  };

  setEthBalance = (ethBalance: ethers.utils.BigNumber) => {
    this.setState({ ethBalance });
  };

  setDaiBalance = (daiBalance: ethers.utils.BigNumber) => {
    this.setState({ daiBalance });
  };

  fetchAndSetTxns() {
    let url: String;
    switch (this.state.currency) {
      case Currency.DAI:
        url = `Needs url`
      case Currency.ETH:
        url = `Needs url`
        break;
      default:
        url = `https://blockscout.com/poa/dai/api?module=account&action=txlist&address=`
        break;
    }

    fetch(url + this.state.xDaiWallet.address)
    .then(res => res.json())
    .then(response => {
      this.setState({
        transactions: response.message === "OK" ? response.result : []
      })
    })
  }

  async fetchAndSetBalances() {
    let xDaiBalance = await this.state.xDaiWallet.getBalance();
    let ethBalance = await this.state.ethWallet.getBalance();
    let daiContract = new ethers.Contract(
      DAI, ERC20Abi, this.state.ethProvider
    );
    let daiBalance = await daiContract.balanceOf(this.state.ethWallet.address)

    await this.setState({
      xDaiBalance,
      ethBalance,
      daiBalance,
    })
  }
}