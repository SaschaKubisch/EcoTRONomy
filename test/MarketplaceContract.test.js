const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MarketplaceContract", function () {
  let MarketplaceContract, ERC20CO2Token, marketplace, token, owner, buyer, seller;

  beforeEach(async () => {
    // Deploy ERC20CO2Token contract
    ERC20CO2Token = await ethers.getContractFactory("ERC20CO2Token");
    token = await ERC20CO2Token.deploy();
    await token.deployed();

    // Deploy MarketplaceContract
    MarketplaceContract = await ethers.getContractFactory("MarketplaceContract");
    marketplace = await MarketplaceContract.deploy(token.address);
    await marketplace.deployed();

    // Get signers
    [owner, buyer, seller] = await ethers.getSigners();
  });

  it("Should create a sell order", async function () {
    const amount = ethers.utils.parseUnits("100", 18);

    await token.connect(seller).mint(seller.address, amount);
    await token.connect(seller).approve(marketplace.address, amount);

    await marketplace.connect(seller).createSellOrder(amount, 1);

    const sellOrder = await marketplace.sellOrders(0);
    expect(sellOrder.seller).to.equal(seller.address);
    expect(sellOrder.amount).to.equal(amount);
    expect(sellOrder.pricePerToken).to.equal(1);
  });

  it("Should execute a trade", async function () {
    const amount = ethers.utils.parseUnits("100", 18);
    const pricePerToken = 1;
    const totalPrice = amount.mul(pricePerToken);

    // Seller creates a sell order
    await token.connect(seller).mint(seller.address, amount);
    await token.connect(seller).approve(marketplace.address, amount);
    await marketplace.connect(seller).createSellOrder(amount, pricePerToken);

    // Buyer executes the trade
    await marketplace.connect(buyer).buyTokens(0, { value: totalPrice });

    // Check balances
    expect(await token.balanceOf(seller.address)).to.equal(0);
    expect(await token.balanceOf(buyer.address)).to.equal(amount);
  });
});
