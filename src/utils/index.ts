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

export function formatDaiAmount(amount: BigNumber): string {
  return commify(parseFloat(formatEther(amount)).toFixed(2));
}

// This also removes the cents
export function convertToCOP(amount: BigNumber, rate: BigNumber): string {
  return formatEther(bigNumberify(amount.mul(rate)).toString()).split(".")[0];
}

export function formatToDollars(amount: BigNumber): string {
  const [whole, dec] = formatEther(amount).split(".");
  let decimals: number = 0;
  if (dec[1]) decimals = 2;
  // format Ether still gives a 0 after the decimal point
  if (dec[0] !== "0" && !dec[1]) decimals = 1;
  if (dec.slice(0, 2) === "00") decimals = 0;
  return parseFloat(whole + "." + dec.slice(0, 2)).toFixed(decimals);
}

// this also removes the txn cost from the display value
export function roundDaiDown(amount: BigNumber): string {
  const cost = bigNumberify(1000000000).mul(bigNumberify(21000));

  if (amount.sub(cost).lte(Zero)) {
    return parseFloat(formatEther(amount)).toFixed(2);
  }

  const [whole, dec] = formatEther(amount.sub(cost)).split(".");

  if (dec.slice(0, 2) === "00") {
    if (whole === "0") {
      return whole + "." + dec.slice(0, 4);
    }
    return whole + ".00";
  }

  return whole + "." + dec.slice(0, 2);
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
