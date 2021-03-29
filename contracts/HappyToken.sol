//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract HappyToken is ERC20PresetMinterPauser {
  string _name;
  constructor()ERC20PresetMinterPauser("Happy Token", "HPT") {}
}

