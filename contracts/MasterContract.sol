pragma solidity ^0.8.0;

import "./BridgeContract.sol";
import "./MarketplaceContract.sol";
import "./CO2Token.sol";

contract MasterContract {
    address public admin;
    MarketplaceContract public marketplaceContract;

    mapping(uint256 => BridgeContract) public bridgeContracts;
    mapping(uint256 => CO2Token) public co2Tokens;

    uint256 public trancheCounter;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function deployNewTranche() external onlyAdmin {
        BridgeContract newBridge = new BridgeContract();
        CO2Token newCO2Token = new CO2Token("Carbon Credit Token", "CCT");

        bridgeContracts[trancheCounter] = newBridge;
        co2Tokens[trancheCounter] = newCO2Token;
        trancheCounter++;
    }

    function deployMarketplaceContract() external onlyAdmin {
        marketplaceContract = new MarketplaceContract();
    }

    function registerCarbonCredits(
        uint256 trancheId,
        string memory ipfsHash,
        uint256 totalSupply
    ) external onlyAdmin {
        BridgeContract bridge = bridgeContracts[trancheId];
        CO2Token co2Token = co2Tokens[trancheId];

        bridge.registerCarbonCredits(ipfsHash);
        co2Token.setTotalSupply(totalSupply);
    }

    function offerCarbonCredits(uint256 trancheId, uint256 amount) external {
        require(msg.sender == admin, "Not the issuer");
        CO2Token co2Token = co2Tokens[trancheId];

        require(amount <= co2Token.totalSupply(), "Exceeds total supply");

        co2Token.mint(address(marketplaceContract), amount);
        marketplaceContract.offerCarbonCredits(trancheId, amount);
    }


}
