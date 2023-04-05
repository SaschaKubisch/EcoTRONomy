const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BridgeContract", function () {
  let BridgeContract, CO2Token, bridge, token, owner, issuer, verifier;

  beforeEach(async () => {
    // Deploy CO2Token contract
    CO2Token = await ethers.getContractFactory("CO2Token");
    token = await CO2Token.deploy();
    await token.deployed();

    // Deploy BridgeContract
    BridgeContract = await ethers.getContractFactory("BridgeContract");
    bridge = await BridgeContract.deploy(token.address);
    await bridge.deployed();

    // Get signers
    [owner, issuer, verifier] = await ethers.getSigners();
  });

  it("Should register carbon credits", async function () {
    const metadataURI = "ipfs://metadataURI";
    await bridge.connect(issuer).registerCarbonCredits(metadataURI, issuer.address);
    const carbonCredit = await bridge.carbonCredits(1);
    expect(carbonCredit.metadataURI).to.equal(metadataURI);
    expect(carbonCredit.issuer).to.equal(issuer.address);
    expect(carbonCredit.verifier).to.equal(ethers.constants.AddressZero);
    expect(carbonCredit.verified).to.be.false;
  });

  it("Should mint and offer carbon credits", async function () {
    const metadataURI = "ipfs://metadataURI";
    await bridge.connect(issuer).registerCarbonCredits(metadataURI, issuer.address);
    await bridge.connect(issuer).mintAndOfferCarbonCredits(token.address, 1000);
    const balance = await token.balanceOf(bridge.address);
    expect(balance).to.equal(1000);
  });

  it("Should verify carbon credits", async function () {
    const metadataURI = "ipfs://metadataURI";
    await bridge.connect(issuer).registerCarbonCredits(metadataURI, issuer.address);
    await bridge.connect(verifier).verifyCarbonCredits(1, verifier.address);
    const carbonCredit = await bridge.carbonCredits(1);
    expect(carbonCredit.verifier).to.equal(verifier.address);
    expect(carbonCredit.verified).to.be.true;
  });
});
