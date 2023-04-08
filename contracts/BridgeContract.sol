// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./WrappedBCT.sol";
import "./ERC1155Token.sol";

contract CarbonCreditBridge is Ownable {
    CarbonCreditERC1155 public carbonCreditERC1155;
    mapping(address => bool) public supportedWrappers;

    constructor(address _carbonCreditERC1155) {
        carbonCreditERC1155 = CarbonCreditERC1155(_carbonCreditERC1155);
    }

    function addSupportedWrapper(address wrapperAddress) external onlyOwner {
        supportedWrappers[wrapperAddress] = true;
    }

    function removeSupportedWrapper(address wrapperAddress) external onlyOwner {
        supportedWrappers[wrapperAddress] = false;
    }

    function wrapTokens(address wrapperAddress, uint256 amount) external {
        require(
            supportedWrappers[wrapperAddress],
            "CarbonCreditBridge: Unsupported wrapper"
        );
        WrappedBCT wrapper = WrappedBCT(wrapperAddress);
        wrapper.wrap(msg.sender, amount);
        uint256 tokenId = wrapper.getTokenId();
        carbonCreditERC1155.mint(msg.sender, tokenId, amount, "");
    }
}
