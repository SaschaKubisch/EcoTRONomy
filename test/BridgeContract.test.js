const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RegistryContract", function () {
  let RegistryContract, CO2Token, registry, token, owner, issuer, verifier;

  beforeEach(async () => {
    // Deploy CO2Token contract
    CO2Token = await ethers.getContractFactory("CO2Token");
    token = await CO2Token.deploy();
    await token.deployed();

    // Deploy RegistryContract
    RegistryContract = await ethers.getContractFactory("RegistryContract");
    registry = await RegistryContract.deploy(token.address);
    await registry.deployed();

    // Get signers
    [owner, issuer, verifier] = await ethers.getSigners();
  });

  it("Should register carbon credits", async function () {
    const metadataURI = "ipfs://metadataURI";
    await registry.connect(issuer).registerCarbonCredits(metadataURI, issuer.address);
    const carbonCredit = await registry.carbonCredits(1);
    expect(carbonCredit.metadataURI).to.equal(metadataURI);
    expect(carbonCredit.issuer).to.equal(issuer.address);
    expect(carbonCredit.verifier).to.equal(ethers.constants.AddressZero);
    expect(carbonCredit.verified).to.be.false;
  });

  it("Should mint and offer carbon credits", async function () {
    const metadataURI = "ipfs://metadataURI";
    await registry.connect(issuer).registerCarbonCredits(metadataURI, issuer.address);
    await registry.connect(issuer).mintAndOfferCarbonCredits(token.address, 1000);
    const balance = await token.balanceOf(registry.address);
    expect(balance).to.equal(1000);
  });

  it("Should verify carbon credits", async function () {
    const metadataURI = "ipfs://metadataURI";
    await registry.connect(issuer).registerCarbonCredits(metadataURI, issuer.address);
    await registry.connect(verifier).verifyCarbonCredits(1, verifier.address);
    const carbonCredit = await registry.carbonCredits(1);
    expect(carbonCredit.verifier).to.equal(verifier.address);
    expect(carbonCredit.verified).to.be.true;
  });
});
