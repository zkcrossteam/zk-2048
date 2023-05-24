import BN from 'bn.js';

export const contract_abi = {
  contractName: 'AggregatorVerifier',
  abi: [
    {
      inputs: [
        {
          internalType: 'contract AggregatorVerifierCoreStep[]',
          name: '_steps',
          type: 'address[]',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      inputs: [
        {
          internalType: 'uint256[]',
          name: 'proof',
          type: 'uint256[]',
        },
        {
          internalType: 'uint256[]',
          name: 'verify_instance',
          type: 'uint256[]',
        },
        {
          internalType: 'uint256[]',
          name: 'aux',
          type: 'uint256[]',
        },
        {
          internalType: 'uint256[][]',
          name: 'target_instance',
          type: 'uint256[][]',
        },
      ],
      name: 'verify',
      outputs: [],
      stateMutability: 'view',
      type: 'function',
      constant: true,
    },
  ],
};

// Convert a hex string to a byte array
function hexToBNs(hexString: string) {
  const bytes = new Array<BN>(hexString.length / 2);

  for (var i = 0; i < hexString.length; i += 2) {
    bytes[i] = new BN(hexString.slice(i, i + 2), 16);
  }

  return bytes;
}

export function parseArg(input: string) {
  const [value, type] = input.split(':');
  const re1 = new RegExp(/^[0-9A-Fa-f]+$/), // hexdecimal
    re2 = new RegExp(/^\d+$/); // decimal

  // Check if value is a number
  if (!(re1.test(value.slice(2)) || re2.test(value)))
    throw new Error('input value is not an interger number');

  // Convert value byte array
  if (type === 'i64')
    return [
      value.startsWith('0x') ? new BN(value.slice(2), 16) : new BN(value),
    ];

  if (type === 'bytes' || type === 'bytes-packed') {
    if (value.slice(0, 2) !== '0x') {
      throw new Error('bytes input need start with 0x');
    }

    return hexToBNs(value.slice(2));
  }

  throw new Error(`Unsupported input data type: ${type}`);
}

export const parseArgs = (raw: string[]) =>
  raw.map(input => parseArg(input.trim())).flat();
