const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20CO2Token", function () {
  let ERC20CO2Token, token, owner, addr1, addr2;

  beforeEach(async () => {
    // Deploy ERC20CO2Token contract
    ERC20CO2Token = await ethers.getContractFactory("ERC20CO2Token");
    token = await ERC20CO2Token.deploy();
    await token.deployed();

    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  it("Should mint tokens correctly", async function () {
    const amountToMint = ethers.utils.parseUnits("1000", 18);
    await token.connect(owner).mint(addr1.address, amountToMint);
    const addr1Balance = await token.balanceOf(addr1.address);

    expect(addr1Balance).to.equal(amountToMint);
  });

  it("Should burn tokens correctly", async function () {
    const amountToMint = ethers.utils.parseUnits("1000", 18);
    const amountToBurn = ethers.utils.parseUnits("500", 18);

    await token.connect(owner).mint(addr1.address, amountToMint);
    await token.connect(addr1).burn(amountToBurn);
    
    const addr1Balance = await token.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(amountToMint.sub(amountToBurn));
  });

  it("Should transfer tokens correctly", async function () {
    const amountToMint = ethers.utils.parseUnits("1000", 18);
    const amountToTransfer = ethers.utils.parseUnits("200", 18);

    await token.connect(owner).mint(addr1.address, amountToMint);
    await token.connect(addr1).transfer(addr2.address, amountToTransfer);

    const addr2Balance = await token.balanceOf(addr2.address);
    expect(addr2Balance).to.equal(amountToTransfer);
  });

  it("Should allow and handle approvals correctly", async function () {
    const amountToMint = ethers.utils.parseUnits("1000", 18);
    const amountToApprove = ethers.utils.parseUnits("300", 18);
    const amountToTransferFrom = ethers.utils.parseUnits("150", 18);

    await token.connect(owner).mint(addr1.address, amountToMint);
    await token.connect(addr1).approve(addr2.address, amountToApprove);
    await token.connect(addr2).transferFrom(addr1.address, addr2.address, amountToTransferFrom);

    const addr2Balance = await token.balanceOf(addr2.address);
    const addr1Allowance = await token.allowance(addr1.address, addr2.address);

    expect(addr2Balance).to.equal(amountToTransferFrom);
    expect(addr1Allowance).to.equal(amountToApprove.sub(amountToTransferFrom));
  });
});

