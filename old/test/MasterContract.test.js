const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MasterContract", function () {
  let MasterContract, CO2Token, RegistryContract, master, token, registry, owner, issuer, verifier;

  beforeEach(async () => {
    // Deploy CO2Token contract
    CO2Token = await ethers.getContractFactory("CO2Token");
    token = await CO2Token.deploy();
    await token.deployed();

    // Deploy RegistryContract
    RegistryContract = await ethers.getContractFactory("RegistryContract");
    registry = await RegistryContract.deploy(token.address);
    await registry.deployed();

    // Deploy MasterContract
    MasterContract = await ethers.getContractFactory("MasterContract");
    master = await MasterContract.deploy(token.address, registry.address);
    await master.deployed();

    // Get signers
    [owner, issuer, verifier] = await ethers.getSigners();
  });

  it("Should create new registry contracts and ERC20 tokens", async function () {
    const result = await master.connect(owner).createRegistryAndToken();
    const newContracts = await result.wait();
    const newRegistryAddress = newContracts.events.find((event) => event.event === "NewRegistry").args.registry;
    const newTokenAddress = newContracts.events.find((event) => event.event === "NewERC20Token").args.token;

    expect(newRegistryAddress).to.not.equal(ethers.constants.AddressZero);
    expect(newTokenAddress).to.not.equal(ethers.constants.AddressZero);

    const newRegistry = await RegistryContract.attach(newRegistryAddress);
    const newToken = await CO2Token.attach(newTokenAddress);

    expect(await newRegistry.token()).to.equal(newTokenAddress);
    expect(await newToken.registry()).to.equal(newRegistryAddress);
  });
});
