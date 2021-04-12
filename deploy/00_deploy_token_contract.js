const {getAddress} = require("@ethersproject/address")
const {BigNumber} = require("@ethersproject/BigNumber")
const fs = require('fs');

module.exports = async ({getNamedAccounts, deployments, upgrades, network}) => {
  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();
  const {log} = deployments;

  const HappyDao = await ethers.getContractFactory("HappyDao");
  const tokenPrice = ethers.utils.parseEther("0.0001");
  
  const happyDao = await upgrades.deployProxy(HappyDao, [tokenPrice, 5]);
  await happyDao.deployed();

  const happyToken = await happyDao.happyToken();

  console.log(happyToken);
  const implementationStorage = await ethers.provider.getStorageAt(
    happyDao.address,
    '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'
  );
  const implementationAddress = getAddress(
    BigNumber.from(implementationStorage).toHexString()
  );

  log(
    `HappyDao deployed as Proxy at : ${happyDao.address}, implementation: ${implementationAddress}`
  );

  const HappyTokenArtifact = await deployments.getExtendedArtifact('HappyToken');

  const HappyDaoArtifact = await deployments.getExtendedArtifact('HappyDao');
  const happyDaoAsDeployment = {
    address: happyDao.address,
    ...HappyDaoArtifact,
    // TODO :transactionHash: transactionHash for Proxy deployment
    // args ?
    // linkedData ?
    // receipt?
    // libraries ?
  };
  await deployments.save('HappyDao', happyDaoAsDeployment);

  const happyTokenAsDeployment = {
    address: happyToken,
    ...HappyTokenArtifact,
    // TODO :transactionHash: transactionHash for Proxy deployment
    // args ?
    // linkedData ?
    // receipt?
    // libraries ?
  };
  await deployments.save('HappyToken', happyTokenAsDeployment);

  const allContracts = JSON.parse(fs.readFileSync('frontend/contracts/index.json'));
  const chainIdHex = await network.provider.send('eth_chainId');
  const chainId = BigNumber.from(chainIdHex).toString();
  allContracts[chainId]['HappyDao'] = happyDao.address;
  allContracts[chainId]['HappyToken'] = happyToken;
  fs.writeFileSync('frontend/contracts/index.json', JSON.stringify(allContracts));
  copyFilesToFrontend();
};

function copyFilesToFrontend() {
  const fse = require('fs-extra');
  fse.copySync("deployments", "frontend/contracts", { overwrite: true }, function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log("success!");
    }
  });
}

module.exports.tags = ['HappyDao'];
