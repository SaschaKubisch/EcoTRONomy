// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ERC1155 CO2 Token
 * @dev This is a basic implementation of the ERC1155 CO2 Token Contract.
 * The contract is based on the OpenZeppelin library.
 */
contract ERC1155CO2Token is ERC1155, Ownable {
    // Mapping of token IDs to metadata URIs
    mapping(uint256 => string) private _tokenURIs;

    /**
     * @dev Constructor, initializes the token with a URI for metadata.
     * @param uri The metadata URI.
     */
    constructor(string memory uri) ERC1155(uri) {}

    /**
     * @dev Sets the metadata URI for a given token ID.
     * Only callable by the contract owner.
     * @param tokenId The token ID.
     * @param newURI The new metadata URI.
     */
    function setTokenURI(uint256 tokenId, string memory newURI) public onlyOwner {
        _tokenURIs[tokenId] = newURI;
    }

    /**
     * @dev Returns the metadata URI for a given token ID.
     * @param tokenId The token ID.
     * @return The metadata URI.
     */
    function tokenURI(uint256 tokenId) public view returns (string memory) {
        return _tokenURIs[tokenId];
    }

    /**
     * @dev Burns the specified amount of tokens for a given token ID from the target address.
     * @param account The address to burn tokens from.
     * @param tokenId The token ID.
     * @param amount The amount of tokens to burn.
     */
    function burn(
        address account,
        uint256 tokenId,
        uint256 amount
    ) public {
        require(
            account == _msgSender() || isApprovedForAll(account, _msgSender()),
            "ERC1155: caller is not owner nor approved"
        );
        _burn(account, tokenId, amount);
    }
}