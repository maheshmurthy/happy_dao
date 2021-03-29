require("@nomiclabs/hardhat-waffle");
require('@openzeppelin/hardhat-upgrades');
require('hardhat-deploy');
require('solidity-coverage');
require("hardhat-watcher");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("latest_block", "Prints the latest block number", async() => {
  await ethers.provider.getBlockNumber().then((blockNumber) => {
    console.log("Current block number: " + blockNumber);
  });
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const { infuraApiKey, privateKey } = require('./secrets.json');

module.exports = {
  solidity: "0.8.0",
  networks: {
    ropsten: {
      url: `https://ropsten.infura.io/v3/${infuraApiKey}`,
      accounts: [privateKey],
      saveDeployments: true
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${infuraApiKey}`,
      accounts: [privateKey],
      saveDeployments: true
    }
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    }
  },
  watcher: {
    compilation: {
      tasks: ["compile"],
    },
    test: {
      tasks: [{ command: 'test', params: { testFiles: ['{path}'] } }],
      files: ['./test/**/*.js'],
      verbose: true
    }
  }
  
};

