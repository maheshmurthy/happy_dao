const {getAddress} = require("@ethersproject/address")
const {BigNumber} = require("@ethersproject/BigNumber")

module.exports = async ({getNamedAccounts, deployments, upgrades}) => {
  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();
  const {log} = deployments;

  //const Token = await ethers.getContractFactory("HappyToken");
  //const token = await Token.deploy();
  //await token.deployed();
  
  //console.log("Token deployed to:", token.address);

  const Dao = await ethers.getContractFactory("HappyDao");
  const dao = await upgrades.deployProxy(Dao, [1000000, 5]);
  await dao.deployed();
  console.log("Dao deployed to:", dao.address);

/*
  const DaoArtifact = await deployments.getExtendedArtifact('Dao');
  const daoAsDeployment = {
    address: dao.address,
    ...DaoArtifact,
    // TODO :transactionHash: transactionHash for Proxy deployment
    // args ?
    // linkedData ?
    // receipt?
    // libraries ?
  };
  await deployments.save('Dao', daoAsDeployment);
*/
};

module.exports.tags = ['HappyToken'];

