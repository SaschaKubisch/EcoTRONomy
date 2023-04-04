const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MasterContract", function () {
  let MasterContract, ERC20CO2Token, BridgeContract, master, token, bridge, owner, issuer, verifier;

  beforeEach(async () => {
    // Deploy ERC20CO2Token contract
    ERC20CO2Token = await ethers.getContractFactory("ERC20CO2Token");
    token = await ERC20CO2Token.deploy();
    await token.deployed();

    // Deploy BridgeContract
    BridgeContract = await ethers.getContractFactory("BridgeContract");
    bridge = await BridgeContract.deploy(token.address);
    await bridge.deployed();

    // Deploy MasterContract
    MasterContract = await ethers.getContractFactory("MasterContract");
    master = await MasterContract.deploy(token.address, bridge.address);
    await master.deployed();

    // Get signers
    [owner, issuer, verifier] = await ethers.getSigners();
  });

  it("Should create new bridge contracts and ERC20 tokens", async function () {
    const result = await master.connect(owner).createBridgeAndToken();
    const newContracts = await result.wait();
    const newBridgeAddress = newContracts.events.find((event) => event.event === "NewBridge").args.bridge;
    const newTokenAddress = newContracts.events.find((event) => event.event === "NewERC20Token").args.token;

    expect(newBridgeAddress).to.not.equal(ethers.constants.AddressZero);
    expect(newTokenAddress).to.not.equal(ethers.constants.AddressZero);

    const newBridge = await BridgeContract.attach(newBridgeAddress);
    const newToken = await ERC20CO2Token.attach(newTokenAddress);

    expect(await newBridge.token()).to.equal(newTokenAddress);
    expect(await newToken.bridge()).to.equal(newBridgeAddress);
  });
});
