// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title ERC20 CO2 Token
 * @dev This is a basic implementation of the ERC20 CO2 Token Contract.
 * The contract is based on the OpenZeppelin library.
 */
contract ERC20CO2Token is ERC20 {
    address private _owner;

    /**
     * @dev Constructor, initializes the token with a name, symbol, and sets the owner.
     * @param name The name of the token.
     * @param symbol The symbol of the token.
     * @param ownerAddress The address of the contract owner.
     */
    constructor(
        string memory name,
        string memory symbol,
        address ownerAddress
    ) ERC20(name, symbol) {
        _owner = ownerAddress;
    }

    /**
     * @dev Returns the address of the contract owner.
     * @return The address of the owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Mints the specified amount of tokens to the target address.
     * Only callable by the contract owner.
     * @param to The address to receive the minted tokens.
     * @param amount The amount of tokens to mint.
     */
    function mint(address to, uint256 amount) public {
        require(msg.sender == _owner, "Only the owner can mint tokens");
        _mint(to, amount);
    }

    /**
     * @dev Burns the specified amount of tokens from the target address.
     * Only callable by the contract owner.
     * @param from The address to burn tokens from.
     * @param amount The amount of tokens to burn.
     */
    function burn(address from, uint256 amount) public {
        require(msg.sender == _owner, "Only the owner can burn tokens");
        _burn(from, amount);
    }
}