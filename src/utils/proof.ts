import BN from 'bn.js';

export const Inputs = (inputs: string[]) => inputs.join(';');

export function bytesToBN(data: Uint8Array, chunkSize = 32) {
  const bns: BN[] = [];

  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    bns.push(new BN(chunk, 'le'));
  }

  return bns;
}
