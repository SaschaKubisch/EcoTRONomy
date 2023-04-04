// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title ERC20CO2Token
 * @dev This contract represents the CO2 token, which is an ERC20 token used for carbon credit trading.
 */
contract ERC20CO2Token is ERC20 {
    address public admin;

    /**
     * @dev Modifier to restrict functions to admin only.
     */
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    /**
     * @dev Constructor initializes the ERC20 token with the specified name and symbol.
     */
    constructor() ERC20("CO2 Token", "CO2T") {
        admin = msg.sender;
    }

    /**
     * @dev Function to mint new tokens.
     * @param to The address that will receive the minted tokens.
     * @param amount The amount of tokens to mint.
     */
    function mint(address to, uint256 amount) external onlyAdmin {
        _mint(to, amount);
    }

    /**
     * @dev Function to burn tokens from the caller's balance.
     * @param amount The amount of tokens to burn.
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
