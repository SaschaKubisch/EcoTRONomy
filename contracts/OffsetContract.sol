// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BridgeContract.sol";
import "./ERC1155Token.sol";

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OffsetServiceContract is ERC1155, Ownable {
    uint256 private _currentNFTId;

    CarbonCreditBridge private _carbonCreditBridge;
    CarbonCreditERC1155 private _carbonCreditERC1155;

    constructor(address carbonCreditBridgeAddress, address carbonCreditERC1155Address, string memory uri) ERC1155(uri) {
        _carbonCreditBridge = CarbonCreditBridge(carbonCreditBridgeAddress);
        _carbonCreditERC1155 = CarbonCreditERC1155(carbonCreditERC1155Address);
    }

    function offsetCarbonCredits(
        address user,
        uint256 tokenId,
        uint256 amount
    ) external {
        require(
            _carbonCreditERC1155.balanceOf(user, tokenId) >= amount,
            "Not enough carbon credits"
        );

        // Burn carbon credits
        _carbonCreditERC1155.burn(user, tokenId, amount);

        // Mint NFT receipt
        _mint(user, _currentNFTId, 1, "");
        _currentNFTId++;
    }
}
