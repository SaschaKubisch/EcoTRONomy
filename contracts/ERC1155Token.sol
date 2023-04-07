// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonCreditERC1155 is ERC1155, Ownable {
    uint256 private _currentTokenID = 1;

    constructor(string memory uri) ERC1155(uri) {}

    function mintFungibleToken(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external onlyOwner {
        _mint(to, id, amount, data);
    }

    function mintNonFungibleToken(
        address to,
        uint256 id,
        bytes memory data
    ) external onlyOwner {
        _mint(to, id, 1, data);
    }

    function burnFungibleToken(
        address account,
        uint256 id,
        uint256 amount
    ) external onlyOwner {
        _burn(account, id, amount);
    }

    function burnNonFungibleToken(address account, uint256 id) external onlyOwner {
        _burn(account, id, 1);
    }

    function getNextTokenID() external onlyOwner returns (uint256) {
        _currentTokenID += 1;
        return _currentTokenID;
    }

    function setURI(string memory newuri) external onlyOwner {
        _setURI(newuri);
    }
}
