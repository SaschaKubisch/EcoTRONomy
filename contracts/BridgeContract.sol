// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./WrappedBCT.sol";
import "./ERC1155Token.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonCreditBridgeContract is Ownable {
    WrappedBCT public wrappedBCT;
    ERC1155Token public erc1155Token;

    constructor(
        WrappedBCT _wrappedBCT,
        ERC1155Token _erc1155Token
    ) {
        wrappedBCT = _wrappedBCT;
        erc1155Token = _erc1155Token;
    }

    function bridgeToucanBCT(address to, uint256 amount) external {
        require(
            wrappedBCT.balanceOf(msg.sender) >= amount,
            "Not enough Wrapped BCT tokens"
        );

        uint256 tokenId = erc1155Token.getNextTokenID();

        // Burn original Toucan BCT tokens
        wrappedBCT.burnFrom(msg.sender, amount);

        // Mint new ERC1155 carbon credits
        erc1155Token.mintFungibleToken(to, tokenId, amount, "");

        emit BridgedToucanBCT(msg.sender, to, tokenId, amount);
    }

    event BridgedToucanBCT(address indexed from, address indexed to, uint256 tokenId, uint256 amount);
}
