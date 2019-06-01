import { utils } from "ethers";

export interface Transaction {
  nonce: number;
  timeStamp: number;
  value: utils.BigNumber;
  hash: string;
  to: string;
  from: string;
  txreceipt_status: boolean;
}

export enum Currency {
  XDAI,
  ETH,
  DAI,
  COP
}

export function currencyToSymbol(currency: Currency) {
  switch (currency) {
    case Currency.DAI:
      return "$";
      break;
    case Currency.ETH:
      return "ETH";
      break;
    case Currency.XDAI:
      return "$";
      break;
    case Currency.COP:
      return "$";
      break;
  }
}

export function currencyToName(currency: Currency) {
  switch (currency) {
    case Currency.DAI:
      return "DAI";
      break;
    case Currency.ETH:
      return "Eth";
      break;
    case Currency.XDAI:
      return "xDAI";
      break;
    case Currency.COP:
      return "COP";
      break;
  }
}
