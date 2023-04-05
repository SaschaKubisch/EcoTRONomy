const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Integration Tests", function () {
  let MasterContract, BridgeContract, ERC20CO2Token, MarketplaceContract;
  let master, bridge, token, marketplace;
  let owner, issuer, verifier, buyer, seller;

  beforeEach(async () => {
    // Deploy MasterContract
    MasterContract = await ethers.getContractFactory("MasterContract");
    master = await MasterContract.deploy();
    await master.deployed();

    // Deploy BridgeContract
    BridgeContract = await ethers.getContractFactory("BridgeContract");
    bridge = await BridgeContract.deploy(master.address);
    await bridge.deployed();

    // Deploy ERC20CO2Token
    ERC20CO2Token = await ethers.getContractFactory("ERC20CO2Token");
    token = await ERC20CO2Token.deploy();
    await token.deployed();

    // Deploy MarketplaceContract
    MarketplaceContract = await ethers.getContractFactory("MarketplaceContract");
    marketplace = await MarketplaceContract.deploy(master.address);
    await marketplace.deployed();

    // Get signers
    [owner, issuer, verifier, buyer, seller] = await ethers.getSigners();

    // Add roles
    await master.addIssuer(issuer.address);
    await master.addVerifier(verifier.address);
  });

  it("Should register, mint, offer, and buy carbon credits correctly", async function () {
    // Register carbon credits
    const carbonCreditsData = "QmRiW5M5S5MJ5q3y5Y1B5W1m8d4G4fJh8W8Cbb7Y5z6a5x";
    await bridge.connect(issuer).registerCarbonCredits(carbonCreditsData);

    // Verify carbon credits
    const carbonCreditsId = 1;
    await bridge.connect(verifier).verifyCarbonCredits(carbonCreditsId);

    // Mint and offer carbon credits
    const amountToMint = ethers.utils.parseUnits("1000", 18);
    await token.connect(issuer).mint(marketplace.address, amountToMint);
    await marketplace.connect(issuer).offerCarbonCredits(carbonCreditsId, amountToMint);

    // Buy carbon credits
    const amountToBuy = ethers.utils.parseUnits("200", 18);
    const purchasePrice = ethers.utils.parseUnits("0.1", 18);
    await buyer.sendTransaction({ to: marketplace.address, value: purchasePrice });
    await marketplace.connect(buyer).buyCarbonCredits(carbonCreditsId, amountToBuy);

    // Check balances
    const buyerBalance = await token.balanceOf(buyer.address);
    const marketplaceBalance = await ethers.provider.getBalance(marketplace.address);

    expect(buyerBalance).to.equal(amountToBuy);
    expect(marketplaceBalance).to.equal(purchasePrice);
  });
});

