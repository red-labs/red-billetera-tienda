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

  updateTransactions = async () => {
    const url: String = `https://blockscout.com/poa/dai/api?module=account&action=txlist&address=`;
    const res = await fetch(url + this.state.xDaiWallet.address);

    if (res.status !== 200) {
      return;
    }

    const parsed = await res.json();

    if (parsed.message !== "OK") {
      return;
    }

    const result: {
      nonce: string;
      timeStamp: string;
      value: string;
      hash: string;
      to: string;
      txreceipt_status: string;
    }[] = parsed.result;

    this.setState({
      transactions: result.map(
        (tx): Transaction => {
          return {
            nonce: parseInt(tx.nonce, 10),
            timeStamp: parseInt(tx.timeStamp, 10),
            value: ethers.utils.bigNumberify(tx.value),
            hash: tx.hash,
            to: tx.to,
            txreceipt_status: tx.txreceipt_status === "1"
          };
        }
      )
    });
  };

  startPolls = () => {
    this.updateTransactions();
    setInterval(this.updateTransactions, 5000);

    this.updateXDaiBalance();
    this.state.xDaiProvider.on(this.state.xDaiWallet.address, xDaiBalance =>
      this.setState({ xDaiBalance })
    );

    this.updateEthBalance();
    this.state.ethProvider.on(this.state.ethWallet.address, ethBalance =>
      this.setState({ ethBalance })
    );

    this.updateDaiBalance();
    // The null field indicates any value matches, this specifies
    // "any Transfer from any to myAddress"
    // This hasn't been tested
    this.state.daiContract.on(
      this.state.daiContract.filters.Transfer(
        null,
        this.state.ethWallet.address
      ),
      daiBalance => this.setState({ daiBalance })
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

    await wallet.sendTransaction({ to, value, gasPrice: 1000000000 });
  };

  setRoute = (route: Route) => {
    this.setState({ route });
  };

  restorePrivateKey = async (privateKey: string) => {
    await this.sweepWallet(ethers.utils.computeAddress(privateKey));
    await this.setState({
      xDaiWallet: new ethers.Wallet(privateKey, this.state.xDaiProvider),
      ethWallet: new ethers.Wallet(privateKey, this.state.ethProvider)
    });
    localStorage.setItem("efectivoPrivateKey", privateKey);
    this.startPolls();
  };

  updateXDaiBalance = async () => {
    this.setState({ xDaiBalance: await this.state.xDaiWallet.getBalance() });
  };

  updateEthBalance = async () => {
    this.setState({ ethBalance: await this.state.ethWallet.getBalance() });
  };

  updateDaiBalance = async () => {
    this.setState({
      daiBalance: await this.state.daiContract.balanceOf(
        this.state.ethWallet.address
      )
    });
  };

  sweepWallet = (address: string) => {
    let gasPrice = ethers.utils.bigNumberify(1000000000);
    let gasLimit = ethers.utils.bigNumberify(21000);

    if (
      this.state.xDaiBalance &&
      !this.state.xDaiBalance.eq(ethers.constants.Zero)
    ) {
      this.sendTx(
        Currency.XDAI,
        address,
        this.state.xDaiBalance.sub(gasPrice.mul(gasLimit))
      );
    }
  };
}
