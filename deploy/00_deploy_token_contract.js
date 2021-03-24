const {getAddress} = require("@ethersproject/address")
const {BigNumber} = require("@ethersproject/BigNumber")

module.exports = async ({getNamedAccounts, deployments, upgrades}) => {
  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();
  const {log} = deployments;

  const Token = await ethers.getContractFactory("Token");
  const token = await upgrades.deployProxy(Token, ['Social Token', 'SCT', 100000]);
  await token.deployed();
  console.log("Token deployed to:", token.address);
  const implementationStorage = await ethers.provider.getStorageAt(
    token.address,
    '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'
  );
  const implementationAddress = getAddress(
    BigNumber.from(implementationStorage).toHexString()
  );

  log(
    `Token deployed as Proxy at : ${token.address}, implementation: ${implementationAddress}`
  );

  const TokenArtifact = await deployments.getExtendedArtifact('Token');
  const tokenAsDeployment = {
    address: token.address,
    ...TokenArtifact,
    // TODO :transactionHash: transactionHash for Proxy deployment
    // args ?
    // linkedData ?
    // receipt?
    // libraries ?
  };
  await deployments.save('Token', tokenAsDeployment);
};

module.exports.tags = ['Token'];
