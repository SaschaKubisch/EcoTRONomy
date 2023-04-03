// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BridgeContract is Ownable {
    using EnumerableSet for EnumerableSet.UintSet;

    // Struct for carbon credit data
    struct CarbonCredit {
        uint256 carbonCredits;
        bool isVerified;
        string ipfsCID;
    }

    // Mapping to store tokenId to CarbonCredit data
    mapping(uint256 => CarbonCredit) public carbonCreditsData;

    // Addresses allowed to issue and verify carbon credits
    address public issuerAddress;
    address public verifierAddress;

    // Event emitted when carbon credits are registered
    event CarbonCreditsRegistered(uint256 tokenId, uint256 carbonCredits, string ipfsCID);

    // Event emitted when carbon credits are signed
    event CarbonCreditsSigned(uint256 tokenId, address verifierAddress);

    constructor(address _issuerAddress, address _verifierAddress) {
        issuerAddress = _issuerAddress;
        verifierAddress = _verifierAddress;
    }

    // Function to register carbon credits
    function registerCarbonCredits(uint256 tokenId, uint256 carbonCredits, string memory ipfsCID) external onlyIssuer {
        require(carbonCreditsData[tokenId].carbonCredits == 0, "Carbon credits already registered");

        carbonCreditsData[tokenId] = CarbonCredit({
            carbonCredits: carbonCredits,
            isVerified: false,
            ipfsCID: ipfsCID
        });

        emit CarbonCreditsRegistered(tokenId, carbonCredits, ipfsCID);
    }

    // Function to sign carbon credits
    function signCarbonCredits(uint256 tokenId) external onlyVerifier {
        require(carbonCreditsData[tokenId].carbonCredits > 0, "Carbon credits not registered");
        require(!carbonCreditsData[tokenId].isVerified, "Carbon credits already verified");

        carbonCreditsData[tokenId].isVerified = true;

        emit CarbonCreditsSigned(tokenId, verifierAddress);
    }

    // Modifier to restrict function calls to only issuer
    modifier onlyIssuer() {
        require(msg.sender == issuerAddress, "Only issuer can call this function");
        _;
    }

    // Modifier to restrict function calls to only verifier
    modifier onlyVerifier() {
        require(msg.sender == verifierAddress, "Only verifier can call this function");
        _;
    }
}