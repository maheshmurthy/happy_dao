const {getAddress} = require("@ethersproject/address")
const {BigNumber} = require("@ethersproject/BigNumber")

module.exports = async ({getNamedAccounts, deployments, upgrades}) => {
  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();
  const {log} = deployments;

  const HappyDao = await ethers.getContractFactory("HappyDao");
  const currentHappyDao = await deployments.get("HappyDao");
  const happyDao = await upgrades.upgradeProxy(currentHappyDao.address, HappyDao);
  await happyDao.deployed();

  log(
    `HappyDao deployed as Proxy at : ${happyDao.address}`
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

module.exports.tags = ['HappyDaoV2'];
