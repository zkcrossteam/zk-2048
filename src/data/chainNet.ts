import { DelphinusWeb3 } from 'web3subscriber/src/client';

export const chainNet = {
  chainId: 97,
  chainName: 'Binance Smart Chain Testnet',
  nativeCurrency: {
    name: 'Binance Chain Native Token',
    symbol: 'tBNB',
    decimals: 18,
  },
  rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
  blockExplorerUrls: ['https://testnet.bscscan.com'],
};

export const switchNet = async (web3: DelphinusWeb3) => {
  const { chainId, chainName, nativeCurrency, rpcUrls, blockExplorerUrls } =
    chainNet;

  await web3.switchNet(
    web3.web3Instance.utils.numberToHex(chainId),
    chainName,
    rpcUrls[0],
    nativeCurrency,
    blockExplorerUrls[0],
  );
};
