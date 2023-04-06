const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MarketplaceContract", function () {
  let MarketplaceContract, CO2Token, RegistryContract, marketplace, token, registry, owner, buyer, seller;

  beforeEach(async () => {
    // Deploy CO2Token contract
    CO2Token = await ethers.getContractFactory("CO2Token");
    token = await CO2Token.deploy();
    await token.deployed();

    // Deploy RegistryContract
    RegistryContract = await ethers.getContractFactory("RegistryContract");
    registry = await RegistryContract.deploy(token.address);
    await registry.deployed();

    // Deploy MarketplaceContract
    MarketplaceContract = await ethers.getContractFactory("MarketplaceContract");
    marketplace = await MarketplaceContract.deploy(token.address, registry.address);
    await marketplace.deployed();

    // Get signers
    [owner, buyer, seller] = await ethers.getSigners();
  });

  it("Should offer CO2 tokens for sale", async function () {
    const amountToOffer = ethers.utils.parseUnits("100", 18);
    await token.connect(seller).approve(marketplace.address, amountToOffer);
    await marketplace.connect(seller).offerCO2Tokens(amountToOffer);

    const offer = await marketplace.offers(seller.address);
    expect(offer.seller).to.equal(seller.address);
    expect(offer.amount).to.equal(amountToOffer);
  });

  it("Should allow buyer to purchase CO2 tokens", async function () {
    const amountToBuy = ethers.utils.parseUnits("50", 18);

    // Offer tokens for sale
    const amountToOffer = ethers.utils.parseUnits("100", 18);
    await token.connect(seller).approve(marketplace.address, amountToOffer);
    await marketplace.connect(seller).offerCO2Tokens(amountToOffer);

    // Buyer purchases tokens
    await token.connect(buyer).approve(marketplace.address, amountToBuy);
    await marketplace.connect(buyer).buyCO2Tokens(seller.address, amountToBuy);

    const sellerBalance = await token.balanceOf(seller.address);
    const buyerBalance = await token.balanceOf(buyer.address);

    expect(sellerBalance).to.equal(amountToOffer.sub(amountToBuy));
    expect(buyerBalance).to.equal(amountToBuy);
  });
});

