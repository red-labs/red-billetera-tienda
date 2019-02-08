//@ts-ignore
import baseEmoji from "base-emoji";
import { utils } from "ethers";

export function addressToEmoji(address: string) {
  const hash = utils.keccak256(address);
  const last2bytes = hash.slice(-4);
  const buf = new Buffer(last2bytes, "hex");
  return baseEmoji.toUnicode(buf);
}
