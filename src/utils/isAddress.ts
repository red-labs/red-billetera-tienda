import { ethers } from "ethers";

/**
 * Checks if the given string is an address
 *
 * @method isAddress
 *
 * @param {String} address the given HEX address
 *
 * @returns {Boolean}
 */
export const isAddress = (address: string) => {
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
};

/**
 * Checks if the given string is a checksummed address
 *
 * @method checkAddressChecksum
 *
 * @param {String} address the given HEX address
 *
 * @returns {Boolean}
 */
export const checkAddressChecksum = (address: string) => {
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
};
