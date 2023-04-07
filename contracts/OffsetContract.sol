// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./WrappedBCT.sol";

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OffsetServiceContract is ERC1155, Ownable {
    uint256 private _currentNFTId;

    WrappedBCT private _wrappedBCT;

    constructor(address wrappedBCTAddress, string memory uri) ERC1155(uri) {
        _wrappedBCT = WrappedBCT(wrappedBCTAddress);
    }

    function offsetCarbonCredits(
        address user,
        uint256 wrappedBCTAmount
    ) external {
        require(
            _wrappedBCT.balanceOf(user) >= wrappedBCTAmount,
            "Not enough Wrapped BCT tokens"
        );

        // Burn Wrapped BCT tokens
        _wrappedBCT.burnFrom(user, wrappedBCTAmount);

        // Mint NFT receipt
        _mint(user, _currentNFTId, 1, "");
        _currentNFTId++;
    }
}
