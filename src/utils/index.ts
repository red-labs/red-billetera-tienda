//@ts-ignore
import baseEmoji from "base-emoji";
import {
  BigNumber,
  formatEther,
  commify,
  bigNumberify,
  parseEther,
  keccak256,
  getAddress
} from "ethers/utils";
import { Zero } from "ethers/constants";

export function add0x(str: string) {
  return str.substring(0, 2) === "0x" ? str : "0x" + str;
}

export function isNonZeroNumber(number?: string) {
  return !!(number && !isNaN(number as any) && !parseEther(number).eq(Zero));
}

// This also removes the cents
export function convertToCOP(amount: BigNumber, rate: BigNumber): string {
  return commify(
    formatEther(bigNumberify(amount.mul(rate)).toString()).split(".")[0]
  );
}

export function convertFromCOP(amount: string, rate: BigNumber): number {
  const inverseCOPRate = 1 / rate.toNumber();
  return isNaN(parseInt(amount, 10))
    ? 0
    : parseInt(amount, 10) * inverseCOPRate;
}

export function subtractTxnCost(amount: BigNumber): BigNumber {
  const cost = bigNumberify(1000000000).mul(bigNumberify(21000));
  if (amount.sub(cost).lte(Zero)) {
    return Zero;
  }
  return amount.sub(cost);
}

export function toWei(amount: number): BigNumber {
  return parseEther(amount.toString());
}

// this also removes the txn cost from the display value
export function formatToDollars(
  amount: BigNumber | number,
  wei = true
): string {
  let [dollars, cents] = (wei ? formatEther(amount) : amount.toString()).split(
    "."
  );

  if (!cents) {
    cents = "00";
  }

  if (!dollars) {
    dollars = "0";
  }

  // Turn stuff like 3.2 into 3.20
  if (!cents[1]) {
    return dollars + "." + cents + "0";
  }

  // Show extra decimals for very small amounts under 1. Over one, show 00.
  // i.e. 0.0002 -> 0.0002 and 1.0002 -> 1.00
  if (cents.slice(0, 2) === "00") {
    if (dollars === "0") {
      return dollars + "." + cents.slice(0, 4);
    }
    return dollars + ".00";
  }

  return dollars + "." + cents.slice(0, 2);
}

export function addressToEmoji(address: string) {
  const hash = keccak256(address);
  const last2bytes = hash.slice(-4);
  const buf = new Buffer(last2bytes, "hex");
  return baseEmoji.toUnicode(buf);
}

export function randomHex(size: number) {
  if (size > 65536) {
    throw new Error("Requested too many random bytes.");
  }

  var cryptoLib: any = window.crypto || (window as any).msCrypto;

  if (cryptoLib) {
    var randomBytes = cryptoLib.getRandomValues(new Uint8Array(size));

    return Buffer.from(randomBytes).toString("hex");
  } else {
    var error = new Error(
      'No "crypto" object available. This Browser doesn\'t support generating secure random bytes.'
    );

    throw error;
  }
}

export function cleanAddress(address: string): string | undefined {
  try {
    return getAddress(address);
  } catch (e) {
    return undefined;
  }
}

export function promiseTimeout(
  ms: number,
  promise: any,
  msg: string
): Promise<any> {
  let timeout = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(msg);
    }, ms);
  });
  return Promise.race([promise, timeout]);
}

// export function isAddress(address: string) {
//   // check if it has the basic requirements of an address
//   if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
//     return false;
//     // If it's ALL lowercase or ALL upppercase
//   } else if (
//     /^(0x|0X)?[0-9a-f]{40}$/.test(address) ||
//     /^(0x|0X)?[0-9A-F]{40}$/.test(address)
//   ) {
//     return true;
//     // Otherwise check each case
//   } else {
//     return checkAddressChecksum(address);
//   }
// }

// export function checkAddressChecksum(address: string) {
//   // Check each case
//   address = add0x(address);
//   const addressHash = ethers.utils
//     .keccak256(address.toLowerCase())
//     .replace(/^0x/i, "");

//   for (let i = 0; i < 40; i++) {
//     // the nth letter should be uppercase if the nth digit of casemap is 1
//     if (
//       (parseInt(addressHash[i], 16) > 7 &&
//         address[i].toUpperCase() !== address[i]) ||
//       (parseInt(addressHash[i], 16) <= 7 &&
//         address[i].toLowerCase() !== address[i])
//     ) {
//       return false;
//     }
//   }
//   return true;
// }
