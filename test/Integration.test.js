const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Carbon Credit System Integration", function () {
  let WrappedBCT, wrappedBCT, CarbonCreditERC1155, carbonCreditERC1155, OffsetServiceContract, offsetServiceContract, owner, addr1, addr2, bctToken;

  beforeEach(async function () {
    // Deploy CarbonCreditERC1155 contract
    CarbonCreditERC1155 = await ethers.getContractFactory("CarbonCreditERC1155");
    [owner, addr1, addr2, _] = await ethers.getSigners();
    carbonCreditERC1155 = await CarbonCreditERC1155.deploy("https://example.com/metadata/");

    // Deploy WrappedBCT contract
    WrappedBCT = await ethers.getContractFactory("WrappedBCT");
    wrappedBCT = await WrappedBCT.deploy(carbonCreditERC1155.address);

    // Deploy OffsetServiceContract
    OffsetServiceContract = await ethers.getContractFactory("OffsetServiceContract");
    offsetServiceContract = await OffsetServiceContract.deploy(carbonCreditERC1155.address);

    // Simulate BCT Token contract
    bctToken = await ethers.getContractFactory("BCTToken");
    bctToken = await bctToken.deploy("Toucan BCT Token", "BCT", 18);

    // Mint BCT tokens to addr1
    await bctToken.connect(owner).mint(addr1.address, ethers.utils.parseEther("100"));

    // Approve WrappedBCT contract to spend addr1's BCT tokens
    await bctToken.connect(addr1).approve(wrappedBCT.address, ethers.utils.parseEther("100"));
  });

  it("Should wrap BCT tokens, offset emissions, and unwrap BCT tokens successfully", async function () {
    // Wrap BCT tokens
    await wrappedBCT.connect(addr1).wrapBCTTokens(ethers.utils.parseEther("100"));
    expect(await carbonCreditERC1155.balanceOf(addr1.address, 0)).to.equal(ethers.utils.parseEther("100"));
    expect(await bctToken.balanceOf(addr1.address)).to.equal(0);

    // Offset carbon emissions
    await offsetServiceContract.connect(addr1).offsetCarbon(0, ethers.utils.parseEther("50"));
    const receiptId = await offsetServiceContract.connect(addr1).getReceiptId(addr1.address);
    expect(receiptId).to.equal(1);

    const receipt = await carbonCreditERC1155.connect(addr1).uri(receiptId);
    expect(receipt).to.equal("https://example.com/metadata/1");

    expect(await carbonCreditERC1155.balanceOf(addr1.address, 0)).to.equal(ethers.utils.parseEther("50"));

    // Unwrap BCT tokens
    await wrappedBCT.connect(addr1).unwrapBCTTokens(ethers.utils.parseEther("50"));
    expect(await carbonCreditERC1155.balanceOf(addr1.address, 0)).to.equal(0);
    expect(await bctToken.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("50"));
  });
});
