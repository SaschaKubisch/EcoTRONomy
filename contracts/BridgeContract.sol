// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BridgeContract {
    IERC20 public co2Token;
    address public admin;
    uint256 public nonce;
    mapping(uint256 => bool) public processedNonces;

    event CarbonCreditsRegistered(uint256 indexed nonce, address indexed issuer, uint256 amount);
    event CarbonCreditsVerified(uint256 indexed nonce, address indexed verifier);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor(address _co2Token) {
        admin = msg.sender;
        co2Token = IERC20(_co2Token);
    }

    function registerCarbonCredits(uint256 amount) external onlyAdmin {
        nonce++;
        co2Token.mint(address(this), amount);
        emit CarbonCreditsRegistered(nonce, msg.sender, amount);
    }

    function verifyCarbonCredits(uint256 _nonce) external onlyAdmin {
        require(!processedNonces[_nonce], "Already processed");
        processedNonces[_nonce] = true;
        emit CarbonCreditsVerified(_nonce, msg.sender);
    }

    function setAdmin(address newAdmin) external onlyAdmin {
        admin = newAdmin;
    }
}
