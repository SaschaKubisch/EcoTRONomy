// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "./PoolContract.sol";

contract MarketplaceContract {
    address public owner;
    PoolContract public poolContract;
    IERC1155 public erc1155Token;

    mapping(uint256 => uint256) public tokenPrice;

    event TokenPurchased(uint256 tokenId, address buyer, uint256 amount);
    event TokenListed(uint256 tokenId, uint256 price);
    event TokenDelisted(uint256 tokenId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    constructor(address _poolContractAddress, address _erc1155TokenAddress) {
        owner = msg.sender;
        poolContract = PoolContract(_poolContractAddress);
        erc1155Token = IERC1155(_erc1155TokenAddress);
    }

    function buyTokens(uint256 tokenId, uint256 amount) external payable {
        uint256 price = tokenPrice[tokenId];
        require(price > 0, "Token not for sale");
        uint256 cost = price * amount;

        require(msg.value >= cost, "Insufficient funds");

        poolContract.mintCO2Tokens(msg.sender, tokenId, amount);
        erc1155Token.safeTransferFrom(address(this), msg.sender, tokenId, amount, "");

        if (msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost);
        }

        emit TokenPurchased(tokenId, msg.sender, amount);
    }

    function listToken(uint256 tokenId, uint256 price) external onlyOwner {
        tokenPrice[tokenId] = price;
        emit TokenListed(tokenId, price);
    }

    function delistToken(uint256 tokenId) external onlyOwner {
        tokenPrice[tokenId] = 0;
        emit TokenDelisted(tokenId);
    }
}