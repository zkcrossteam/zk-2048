import BN from "bn.js";

export function Inputs(inputs: Array<string>) {
  return inputs.join(";");
}

export function bytesToBN(data:Uint8Array) {
  let chunksize = 64;
  let bns = [];
  for (let i = 0; i < data.length; i += 32) {
    const chunk = data.slice(i, i + 32);
    let a = new BN(chunk,'le');
    bns.push(a);
    // do whatever
  }
  return bns;
}