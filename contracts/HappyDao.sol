//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./HappyToken.sol";

contract HappyDao is Initializable, OwnableUpgradeable {
  HappyToken public happyToken;
  uint256 public tokenPrice;
  uint256 public minTokensToJoin;

  enum Vote {
        Null,
        Yes,
        No
  }

  struct Proposal {
    address proposer;
    address payable applicant;
    string text;
    uint256 amount;
    uint256 yesVotes;
    uint256 noVotes;
    mapping (address => Vote) votes;
    uint256 submissionTime;
    bool disbursed;
  }

  Proposal[] public proposalList;

  event NewProposal(address proposer, address applicant, uint256 amount, uint256 length);

  event FundsDisbursed(address applicant, uint256 amount);

  function initialize(uint256 _price, uint256 _minTokensToJoin) public initializer {
    happyToken = new HappyToken();
    tokenPrice = _price;
    minTokensToJoin = _minTokensToJoin;
    __Ownable_init();
  }

  function totalProposals() public view returns (uint) {
    return proposalList.length;
  }

  function join() public payable {
    console.log("The address %s is requesting join", msg.sender);
    uint256 totalTokens = msg.value/tokenPrice;
    require(totalTokens + happyToken.balanceOf(msg.sender) > minTokensToJoin, "No min tokens");
    console.log("Minting %s tokens", totalTokens);
    happyToken.mint(msg.sender, totalTokens);
  }

  function submitProposal(string memory _proposalText, address payable _applicant, uint256 _amount) public {
    require(canSubmitProposal(msg.sender), "Not enough tokens");
    Proposal storage proposal = proposalList.push();
    proposal.proposer = msg.sender;
    proposal.applicant = _applicant;
    proposal.text = _proposalText;
    proposal.amount = _amount;
    proposal.yesVotes = 0;
    proposal.noVotes = 0;
    proposal.submissionTime = block.timestamp;
    proposal.disbursed = false;
    emit NewProposal(proposal.proposer, proposal.applicant, proposal.amount, proposalList.length - 1);
  }

  function getProposal(uint256 index) public view returns (address proposer, address applicant, string memory text, uint256 amount, uint256 yesVotes,
                                                           uint256 noVotes, bool disbursed) {
    Proposal storage proposal = proposalList[index];
    return (proposal.proposer, proposal.applicant, proposal.text, proposal.amount, proposal.yesVotes, proposal.noVotes, proposal.disbursed);
  }

  function voteForProposal(uint256 proposalId, uint8 vote) public {
    require(isDaoMember(msg.sender), "Not enough tokens");
    require(vote < 3, "Invalid Vote");
    Proposal storage proposal = proposalList[proposalId];
    proposal.votes[msg.sender] = Vote(vote);
    if (Vote(vote) == Vote.Yes) {
      proposal.yesVotes += happyToken.balanceOf(msg.sender);
    } else if (Vote(vote) == Vote.No) {
      proposal.noVotes += happyToken.balanceOf(msg.sender);
    }
  }

  function releaseFund(uint256 proposalId) public {
    Proposal storage proposal = proposalList[proposalId];
    require(proposal.disbursed == false);
    require(proposalHasRequiredYesVotes(proposal.yesVotes, proposal.noVotes),
            "Not min votes");
    require(proposalHasPassedMinDuration(proposal.submissionTime),
            "Not min duration");
    require(address(this).balance > proposal.amount,
            "Not enough balance");
    proposal.applicant.transfer(proposal.amount);

    proposal.disbursed = true;
    emit FundsDisbursed(proposal.applicant, proposal.amount);
  }

  function isDaoMember(address member) public view returns (bool) {
    return (happyToken.balanceOf(member) >= minTokensToJoin);
  }

  function canSubmitProposal(address member) public view returns (bool) {
    return (happyToken.balanceOf(member) >= minTokensToJoin * 3);
  }

  function proposalHasRequiredYesVotes(uint256 yesVoteCount, uint256 noVoteCount) public view returns (bool) {
    return (yesVoteCount > noVoteCount && yesVoteCount > happyToken.totalSupply()/3);
  }

  function proposalHasPassedMinDuration(uint256 submissionTime) public view returns (bool) {
    return (block.timestamp - submissionTime > 10 seconds);
  }
}
