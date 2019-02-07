import { ethers } from "ethers";
import { Currency, Transaction } from "../types";
import { Container } from "unstated";

// This is a simplified ABI that only has the functions
// that the app might care about.
import ERC20Abi from "../utils/ERC20.json";

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
  daiContract: ethers.Contract;
}

const DAI = "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359";

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
    const daiContract = new ethers.Contract(DAI, ERC20Abi, ethProvider);

    xDaiProvider.on(xDaiWallet.address, this.setXDaiBalance);
    ethProvider.on(ethWallet.address, this.setEthBalance);

    // The null field indicates any value matches, this specifies
    // "any Transfer from any to myAddress"
    let filter = daiContract.filters.Transfer(null, ethWallet.address);
    // This hasn't been tested
    daiContract.on(filter, this.setDaiBalance);

    this.state = {
      currency: Currency.XDAI,
      route: Route.Main,
      xDaiProvider,
      ethProvider,
      xDaiWallet,
      ethWallet,
      transactions: [],
      daiContract
    };
  }

  fetchTxns = () => {
    let url: String = `https://blockscout.com/poa/dai/api?module=account&action=txlist&address=`;
    return fetch(url + this.state.xDaiWallet.address)
      .then(res => res.json())
      .then(response => {
        if (response.message === "OK") {
          response.result = this.convertTxns(response.result);
        }
        return response;
      });
  };

  convertTxns = (txns: any): Transaction[] => {
    return txns.map(
      ({
        nonce,
        timeStamp,
        value,
        hash,
        to,
        txreceipt_status
      }: {
        nonce: string;
        timeStamp: string;
        value: string;
        hash: string;
        to: string;
        txreceipt_status: string;
      }) => {
        return {
          nonce: parseInt(nonce, 10),
          timeStamp: parseInt(timeStamp, 10),
          value: ethers.utils.bigNumberify(value),
          hash,
          to,
          txreceipt_status: txreceipt_status === "1"
        };
      }
    );
  };

  sendTx = async (
    currency: Currency,
    to: string,
    value: ethers.utils.BigNumber
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

    let txn = await wallet.sendTransaction({ to, value, gasPrice: 1000000000 });

    console.log("Gas Price", ethers.utils.formatEther(txn.gasPrice.toString()));
    if (currency === Currency.XDAI) {
      let { transactions: txns } = this.state;
      txns.push({
        nonce: txn.nonce,
        timeStamp: 0,
        value: txn.value,
        hash: txn.hash!,
        to: txn.to!,
        txreceipt_status: false
      });

      await this.setTxns(txns);

      wallet.provider.once(txn.hash!, async () => {
        let result = await this.fetchTxns();
        if (result.message === "OK") this.setTxns(result.result);
      });
    }
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

  setTxns = (transactions: Transaction[]) => {
    this.setState({ transactions });
  };

  sweepwallet = (address: string) => {
    let gasPrice = ethers.utils.bigNumberify(1000000000);
    let gasLimit = ethers.utils.bigNumberify(21000);
    if (this.state.xDaiBalance) {
      this.sendTx(
        Currency.XDAI,
        address,
        this.state.xDaiBalance.sub(gasPrice.mul(gasLimit))
      );
    }
  };
}
