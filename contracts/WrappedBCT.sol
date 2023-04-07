// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WrappedBCT is ERC20, Ownable {
    constructor() ERC20("Wrapped BCT", "WBCT") {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }

    function burnFrom(address from, uint256 amount) external {
        require(balanceOf(from) >= amount, "Not enough Wrapped BCT tokens");
        _burn(from, amount);
    }
}
