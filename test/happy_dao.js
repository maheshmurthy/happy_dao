// We import Chai to use its asserting functions here.
const { expect } = require("chai");

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("Token contract", function () {
  // Mocha has four functions that let you hook into the the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let happyDao;
  let happyToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    const HappyDao = await ethers.getContractFactory("HappyDao");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    happyDao = await upgrades.deployProxy(HappyDao, [1000000, 5]);
    await happyDao.deployed();
    const HappyToken = await ethers.getContractFactory("HappyToken");
    happyToken = (await ethers.getContractFactory("HappyToken")).attach(await happyDao.happyToken())
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
      // Expect receives a value, and wraps it in an Assertion object. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
      expect(await happyDao.owner()).to.equal(owner.address);
      //expect(await happyToken.MINTER_ROLE()).to.equal(owner.address);
    });

    it("should set the total supply to 0", async function () {
      expect((await happyToken.totalSupply()).toNumber()).to.equal(0);
    });
    it("should set the price of token", async function () {
      expect((await happyDao.tokenPrice()).toNumber()).to.equal(1000000);
    });
  });

  describe("Joining Dao", function () {
    it("should fail if minimum tokens not purchased", async function () {
      await expect(happyDao.join()).to.be.revertedWith("You have to purchase minimum tokens to join");
    });

    it("dao should increase total supply of tokens", async function () {
      await happyDao.join({value: 100000000});
      expect((await happyToken.totalSupply()).toNumber()).to.equal(100);
    });

    it("should increase balance of sender", async function () {
      await expect(() => happyDao.connect(addr1).join({value: 100000000}))
        .to.changeTokenBalance(happyToken, addr1, 100);
    });

    it("should allow buying more tokens by existing member even if less than minimum", async function () {
      await happyDao.connect(addr1).join({value: 100000000});
      await happyDao.connect(addr1).join({value: 1000000});
      expect((await happyToken.balanceOf(addr1.address)).toNumber()).to.equal(101);
    });
  });

  describe("Submit Proposal to Dao", function () {
    it("should fail if proposer does not have minimum tokens", async function () {
      const amount = ethers.utils.parseEther("1").toString();
      await expect(happyDao.submitProposal(addr2.address, amount)).to.be.revertedWith("You do not have enough tokens to submit proposal");
    });

    it("should add proposal to the list", async function () {
      await happyDao.join({value: 100000000});
      const amount = ethers.utils.parseEther("1").toString();
      await expect(happyDao.submitProposal(addr2.address, amount))
        .to.emit(happyDao, 'NewProposal')
        .withArgs(owner.address, addr2.address, amount, 0);
    });
  });

  describe("Fetch Proposal", function () {
    it("should fail if invalid index", async function () {
      await happyDao.join({value: 100000000});
      const amount = ethers.utils.parseEther("1").toString();
      happyDao.submitProposal(addr2.address, amount);
      await expect(happyDao.getProposal(2)).to.be.revertedWith("VM Exception while processing transaction");
    });
    
    it("should return proposal by index", async function () {
      await happyDao.join({value: 100000000});
      const amount = ethers.utils.parseEther("1").toString();
      happyDao.submitProposal(addr2.address, amount);
      expect((await happyDao.getProposal(0)).toString()).to.equal([owner.address, addr2.address, ethers.BigNumber.from(amount), ethers.BigNumber.from(0), ethers.BigNumber.from(0)].toString());
    });
  });

  describe("Vote for proposal", function() {
    beforeEach(async function () {
      await happyDao.join({value: 100000000});
      const amount = ethers.utils.parseEther("1").toString();
      happyDao.submitProposal(addr2.address, amount);
    });

    it("should fail if voter is not a member of dao", async function() {
      await expect(happyDao.connect(addr1).voteForProposal(0, 1)).to.be.revertedWith("You do not have enough tokens to vote for proposal");
    });

    it("should fail if voter casts invalid vote", async function() {
      await expect(happyDao.voteForProposal(0, 3)).to.be.revertedWith("Invalid Vote");
    });

    it("should increment Yes vote count if voter votes Yes", async function() {
      await happyDao.voteForProposal(0, 1);
      [proposer, applicant, amount, yesVotes, noVotes] = await happyDao.getProposal(0);
      expect(yesVotes).to.equal(100);
      expect(noVotes).to.equal(0);
    });

    it("should increment No vote count if voter votes No", async function() {
      await happyDao.voteForProposal(0, 2);
      [proposer, applicant, amount, yesVotes, noVotes] = await happyDao.getProposal(0);
      expect(yesVotes).to.equal(0);
      expect(noVotes).to.equal(100);
    });

    it("should not increment yes or no vote counts if voter votes Null", async function() {
      await happyDao.voteForProposal(0, 0);
      [proposer, applicant, amount, yesVotes, noVotes] = await happyDao.getProposal(0);
      expect(yesVotes).to.equal(0);
      expect(noVotes).to.equal(0);
    });
  });

  describe("Release fund", function() {
    beforeEach(async function () {
      await happyDao.join({value: 100000000});
      const amount = ethers.utils.parseEther("1").toString();
      happyDao.submitProposal(addr2.address, amount);
    });

    it("should fail if there isn't enough funds in the treasury", async function() {
      await expect(happyDao.releaseFund(0)).to.be.revertedWith("Proposal does not have minimum votes");
    });

    it("should fail if less than 2 weeks since proposal submission", async function() {
      await happyDao.voteForProposal(0, 1);
      await expect(happyDao.releaseFund(0)).to.be.revertedWith("Proposal has not passed minimum duration");
    });

    it("should fails if not enough funds in the treasury", async function() {
      const amount = ethers.utils.parseEther("100").toString();
      await happyDao.submitProposal(addr2.address, amount);
      await happyDao.voteForProposal(1, 1);
      await network.provider.send("evm_increaseTime", [60*60*24*15]);
      await network.provider.send("evm_mine");
      await expect(happyDao.releaseFund(1)).to.be.revertedWith("The treasury does not have enough balance");
    });

    it("should release funds to the applicant", async function() {
      const amount = ethers.utils.parseEther("1").toString();
      await happyDao.join({value: amount});
      await happyDao.voteForProposal(0, 1);
      await network.provider.send("evm_increaseTime", [60*60*24*15]);
      await network.provider.send("evm_mine");

      await expect(() => happyDao.releaseFund(0)).to.changeEtherBalance(addr2, amount);
    });
  });  
});

