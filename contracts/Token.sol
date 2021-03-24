//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Token is Initializable, OwnableUpgradeable {
  string public name;
  string public symbol;

  uint256 public totalSupply;

  mapping(address => uint256) balances;

  function initialize(string memory _name, string memory _symbol, uint256 _totalSupply) public initializer {
    name = _name;
    symbol = _symbol;
    totalSupply = _totalSupply;
    balances[msg.sender] = totalSupply;
  }

  function transfer(address to, uint256 amount) external {
    console.log("Sender balance is %s Tokens", balances[msg.sender]);
    console.log("Trying to send %s Tokens to %s", amount, to);
    require(balances[msg.sender] >= amount, "Not enough tokens");
    balances[msg.sender] -= amount;
    balances[to] += amount;
  }

  function balanceOf(address account) external view returns (uint256) {
    return balances[account];
  }

}
