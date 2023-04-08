// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WrappedBCT is Ownable {
    IERC20 public wrappedToken;
    uint256 public tokenId;

    constructor(address _wrappedToken, uint256 _tokenId) {
        wrappedToken = IERC20(_wrappedToken);
        tokenId = _tokenId;
    }

    function wrap(address user, uint256 amount) external {
        require(
            wrappedToken.transferFrom(user, address(this), amount),
            "WrappedBCT: Transfer failed"
        );
    }


    function unwrap(address user, uint256 amount) external onlyOwner {
        require(
            wrappedToken.transfer(user, amount),
            "WrappedBCT: Transfer failed"
        );
    }

    function getTokenId() external view returns (uint256) {
        return tokenId;
    }
}
