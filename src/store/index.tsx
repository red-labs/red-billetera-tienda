import { ethers } from "ethers";
import { Currency } from "../types";
import { Container } from "unstated";

export enum Route {
  Main,
  Send,
  Receive,
  Save,
  Advanced
}

export interface RootState {
  route: Route;
  xDaiProvider: ethers.providers.Provider;
  ethProvider: ethers.providers.Provider;
  xDaiWallet: ethers.Wallet;
  ethWallet: ethers.Wallet;
  xDaiBalance?: ethers.utils.BigNumber;
  daiBalance?: ethers.utils.BigNumber;
  ethBalance?: ethers.utils.BigNumber;
}

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

    this.state = {
      route: Route.Main,
      xDaiProvider: xDaiProvider,
      ethProvider: ethProvider,
      xDaiWallet: xDaiWallet,
      ethWallet: ethWallet
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
}
