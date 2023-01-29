//contracts/DumpsterFire.sol
// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DumpsterFire is ERC20 {

    address payable public owner;

    constructor(uint256 initialSupply) ERC20("DumpsterFire Token", "DFT") {
        owner = msg.sender;
        _mint(owner, initialSupply);
    }
}