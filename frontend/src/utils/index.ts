const fs = require('fs');
import ContractAddresses from '../../contracts/index.json';

export const Networks = {
  MainNet: 1,
  Ropsten: 3,
  Rinkeby: 4,
  Goerli: 5,
  Kovan: 42,
  Hardhat: 31337
}

export const shorter = (str) =>
  str?.length > 8 ? str.slice(0, 6) + '...' + str.slice(-4) : str

export const ContractAddress = (chainId) => {
  return ContractAddresses[chainId];
}
