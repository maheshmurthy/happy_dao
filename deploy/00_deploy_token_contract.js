const {getAddress} = require("@ethersproject/address")
const {BigNumber} = require("@ethersproject/BigNumber")

module.exports = async ({getNamedAccounts, deployments, upgrades}) => {
  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();
  const {log} = deployments;

  const HappyDao = await ethers.getContractFactory("HappyDao");
  const tokenPrice = ethers.utils.parseEther("0.01");
  
  const happyDao = await upgrades.deployProxy(HappyDao, [tokenPrice, 5]);
  await happyDao.deployed();
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
};

module.exports.tags = ['HappyDao'];
