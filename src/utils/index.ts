import { ethers } from "ethers";
//@ts-ignore
import baseEmoji from "base-emoji";
import { utils } from "ethers";

export function add0x(str: string) {
  return str.substring(0, 2) === "0x" ? str : "0x" + str;
}

export function isNonZeroNumber(number?: string) {
  return !!(
    number &&
    !isNaN(number as any) &&
    ethers.utils.parseEther(number).toString() !== "0"
  );
}

export function formatDaiAmount(amount?: string) {
  return (
    amount &&
    !isNaN(amount as any) &&
    ethers.utils.parseEther(amount).toString() !== "0" &&
    "$" +
      ethers.utils.commify(
        Math.round(
          parseFloat(
            ethers.utils.formatEther(ethers.utils.parseEther(amount))
          ) * 100
        ) / 100
      )
  );
}

export function addressToEmoji(address: string) {
  const hash = utils.keccak256(address);
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

export function isAddress(address: string) {
  // check if it has the basic requirements of an address
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    return false;
    // If it's ALL lowercase or ALL upppercase
  } else if (
    /^(0x|0X)?[0-9a-f]{40}$/.test(address) ||
    /^(0x|0X)?[0-9A-F]{40}$/.test(address)
  ) {
    return true;
    // Otherwise check each case
  } else {
    return checkAddressChecksum(address);
  }
}

export function checkAddressChecksum(address: string) {
  // Check each case
  address = address.replace(/^0x/i, "");
  const addressHash = ethers.utils
    .keccak256(address.toLowerCase())
    .replace(/^0x/i, "");

  for (let i = 0; i < 40; i++) {
    // the nth letter should be uppercase if the nth digit of casemap is 1
    if (
      (parseInt(addressHash[i], 16) > 7 &&
        address[i].toUpperCase() !== address[i]) ||
      (parseInt(addressHash[i], 16) <= 7 &&
        address[i].toLowerCase() !== address[i])
    ) {
      return false;
    }
  }
  return true;
}
