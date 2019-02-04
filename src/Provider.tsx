import { ethers } from "ethers";
import { Currency } from "./types";
import React, { Component } from "react";
import { Provider, Subscribe, Container } from "unstated";

export enum Route {
  Main,
  Send,
  Receive,
  Save,
  Advanced
}

// interface RootProps {
//   xDaiProvider: ethers.providers.Provider;
//   ethProvider: ethers.providers.Provider;
//   xDaiWallet: ethers.Wallet;
//   ethWallet: ethers.Wallet;
// }

// export interface Context {
//   state: RootState;
//   actions: Actions;
// }

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

// export class AppProvider extends Component<RootProps, RootState> {
//   constructor(props: RootProps) {
//     super(props);
//     this.state = {
//       route: Route.Main,
//       ...props
//     };
//   }

//   async componentDidMount() {
//     this.state.xDaiProvider.on(this.state.xDaiWallet.address, balance => {
//       this.setState({ xDaiBalance: balance });
//     });

//     this.state.xDaiProvider.on(this.state.xDaiWallet.address, balance => {
//       this.setState({ daiBalance: balance });
//     });

//     this.state.ethProvider.on(this.state.ethWallet.address, balance => {
//       this.setState({ ethBalance: balance });
//     });
//   }

//   render() {
//     return (
//       <AppContext.Provider
//         value={{
//           state: this.state,
//           actions: new Actions(this.state)
//         }}
//       >
//         {this.props.children}
//       </AppContext.Provider>
//     );
//   }
// }

// type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// export function withAppContext<
//   P extends { appContext?: AppContextInterface },
//   R = Omit<P, "appContext">
// >(
//   Component: React.ComponentClass<P> | React.StatelessComponent<P>
// ): React.SFC<R> {
//   return function BoundComponent(props: R) {
//     return (
//       <AppContextConsumer>
//         {value => <Component {...props} appContext={value} />}
//       </AppContextConsumer>
//     );
//   };
// }

// export class ContextWrapper extends Component {
//   render() {
//     return (
//       <AppContext.Consumer>
//         {context => {
//           return context ? (
//             React.cloneElement(this.props.children as any, {
//               context
//             })
//           ) : (
//             <div>No Context</div>
//           );
//         }}
//       </AppContext.Consumer>
//     );
//   }
// }
