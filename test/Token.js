const { expect } = require("chai");

describe("Token contract", function() {
  it("Deployment should assign the total supply of tokens to the owner", async function() {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");

    const pseudoToken = await Token.deploy();

    const ownerBalance = await pseudoToken.balanceOf(owner.address);
    expect(await pseudoToken.totalSupply()).to.equal(ownerBalance);
  });
});

describe("Token transactions", function() {
  it("Transfers tokens from one account to another", async function() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");
    const pseudoToken = await Token.deploy();

    await pseudoToken.transfer(addr1.address, 100);

    const addr1Balance = await pseudoToken.balanceOf(addr1.address);
    expect(100).to.equal(addr1Balance);
    
  });
});

