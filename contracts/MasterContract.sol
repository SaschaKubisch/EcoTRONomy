// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BridgeContract.sol";
import "./MarketplaceContract.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MasterContract {
    address public admin;

    BridgeContract public bridgeContract;
    MarketplaceContract public marketplaceContract;
    IERC20 public co2Token;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor(address _co2Token) {
        admin = msg.sender;
        co2Token = IERC20(_co2Token);
    }

    function deployBridgeContract() external onlyAdmin {
        bridgeContract = new BridgeContract();
    }

    function deployMarketplaceContract() external onlyAdmin {
        marketplaceContract = new MarketplaceContract(address(co2Token));
    }

    function setBridgeAdmin(address newAdmin) external onlyAdmin {
        bridgeContract.setAdmin(newAdmin);
    }

    function setMarketplaceAdmin(address newAdmin) external onlyAdmin {
        marketplaceContract.setAdmin(newAdmin);
    }

    function setAdmin(address newAdmin) external onlyAdmin {
        admin = newAdmin;
    }
}
