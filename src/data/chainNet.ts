import { DelphinusWeb3 } from 'web3subscriber/src/client';

export const chainNet = {
  chainId: 5,
  chainName: 'Goerli test network',
  nativeCurrency: {
    name: 'GoerliETH',
    symbol: 'GoerliETH',
    decimals: 18,
  },
  rpcUrls: ['https://goerli.infura.io/v3/'],
  blockExplorerUrls: ['https://goerli.etherscan.io'],
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
