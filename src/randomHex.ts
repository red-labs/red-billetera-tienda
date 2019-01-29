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
