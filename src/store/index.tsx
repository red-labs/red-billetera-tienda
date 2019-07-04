import { ethers } from "ethers";
import { bigNumberify, BigNumber } from "ethers/utils";
import { Currency, Transaction } from "../types";
import { Container } from "unstated";
import { promiseTimeout } from "../utils";

// This is a simplified ABI that only has the functions
// that the app might care about.
import ERC20Abi from "../utils/ERC20.json";

export enum Route {
  Main,
  Send,
  Receive,
  Recover,
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
  txSendingAlert: boolean;
  txSuccessAlert: boolean;
  txErrorAlert: boolean;
  saveAlertOpen: boolean;
  restoreAlertOpen: boolean;
  failedRestoreAlertOpen: boolean;
  pleaseWaitAlertOpen: boolean;
  addressCopiedAlertOpen: boolean;
  addressCopiedEmojiAlertOpen: boolean;
  usdcop?: ethers.utils.BigNumber;
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
      "https://dai.poa.network"
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
      daiContract,
      txSendingAlert: false,
      txSuccessAlert: false,
      txErrorAlert: false,
      saveAlertOpen: false,
      restoreAlertOpen: false,
      failedRestoreAlertOpen: false,
      pleaseWaitAlertOpen: false,
      addressCopiedAlertOpen: false,
      addressCopiedEmojiAlertOpen: false
    };
  }

  fetchCOPRate = async (): Promise<BigNumber | undefined> => {
    let res = await fetch("https://sasquatch.network/usdcop");
    if (res.status !== 200) throw `Invalid response code: ${res.status}`;
    const parsed = await res.json();
    if (!parsed.success) throw `Request not successful`;
    console.log("CALLED API", parsed.quotes.USDCOP);
    return parsed.quotes.USDCOP;
  };

  startUsdCopRatePoll = () => {
    let usdcopStorage = localStorage.getItem("usdcop");
    let lastRateTimeStamp = localStorage.getItem("lastRateTimeStamp");
    if (
      usdcopStorage === null ||
      new Date().getTime() - parseInt(lastRateTimeStamp!) > 1000 * 60 * 60 * 24 // 1 day
    ) {
      this.fetchCOPRate()
        .then(usdcopBN => {
          if (usdcopBN) {
            localStorage.setItem(
              "usdcop",
              parseFloat(usdcopBN.toString()).toFixed(0)
            );
            localStorage.setItem(
              "lastRateTimeStamp",
              new Date().getTime().toString()
            );
            this.setState({
              usdcop: bigNumberify(parseFloat(usdcopBN.toString()).toFixed(0))
            });
          }
        })
        .catch(e => console.log(`Could not fetch USD_COP rate: ${e}`));
    } else {
      this.setState({
        usdcop: bigNumberify(
          parseFloat(usdcopStorage)
            .toFixed()
            .toString()
        )
      });
    }
  };

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
      from: string;
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
            from: tx.from,
            txreceipt_status: tx.txreceipt_status === "1"
          };
        }
      )
    });
  };

  startPolls = () => {
    this.updateTransactions();

    this.updateXDaiBalance();
    this.state.xDaiProvider.on(this.state.xDaiWallet.address, xDaiBalance => {
      this.updateTransactions();
      this.setState({ xDaiBalance });
    });

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
    let gasPrice: ethers.utils.BigNumber;
    let gasLimit: ethers.utils.BigNumber;
    let data: string = "0x";
    switch (currency) {
      case Currency.DAI:
        wallet = this.state.ethWallet;
        gasPrice = await this.state.ethProvider.getGasPrice();
        gasLimit = await this.state.daiContract.estimate.transfer(to, value);
        data = "0x<transfer><to><value>";
      case Currency.ETH:
        wallet = this.state.ethWallet;
        gasPrice = await this.state.ethProvider.getGasPrice();
        gasLimit = ethers.utils.bigNumberify(21000);
        break;
      default:
        gasPrice = ethers.utils.bigNumberify(1000000000);
        gasLimit = ethers.utils.bigNumberify(21000);
        wallet = this.state.xDaiWallet;
        break;
    }

    return await wallet.sendTransaction({
      to,
      value,
      gasPrice
    });
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

  sweepWallet = async (address: string) => {
    let gasPrice: ethers.utils.BigNumber;
    let gasLimit: ethers.utils.BigNumber;

    if (
      this.state.xDaiBalance &&
      !this.state.xDaiBalance.eq(ethers.constants.Zero)
    ) {
      gasPrice = ethers.utils.bigNumberify(1000000000);
      gasLimit = ethers.utils.bigNumberify(21000);
      let txn = await this.sendTx(
        Currency.XDAI,
        address,
        this.state.xDaiBalance.sub(gasPrice.mul(gasLimit))
      );

      if (txn.hash) {
        let ms = 15000;
        return await promiseTimeout(
          ms,
          this.state.xDaiProvider.waitForTransaction(txn.hash),
          "Transaction not mined after " + ms + " timeout out"
        );
      }
    }

    /*
    Future code for sweeping DAI and ETH
    if (
      this.state.daiBalance &&
      !this.state.daiBalance.eq(ethers.constants.Zero)
    ) {
      await this.state.daiContract.estimate.transfer();
      await this.sendTx(Currency.DAI, address, this.state.daiBalance);
    }

    if (
      this.state.ethBalance &&
      !this.state.ethBalance.eq(ethers.constants.Zero)
    ) {
      await this.sendTx(Currency.ETH, address);
    }
    */
  };
}
