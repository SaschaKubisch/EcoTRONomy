const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CarbonCreditERC1155", function () {
  let CarbonCreditERC1155, carbonCreditERC1155, owner, addr1, addr2;

  beforeEach(async function () {
    CarbonCreditERC1155 = await ethers.getContractFactory("CarbonCreditERC1155");
    [owner, addr1, addr2, _] = await ethers.getSigners();
    carbonCreditERC1155 = await CarbonCreditERC1155.deploy("https://example.com/metadata/");
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await carbonCreditERC1155.owner()).to.equal(owner.address);
    });

    it("Should set the correct URI", async function () {
      expect(await carbonCreditERC1155.uri(1)).to.equal("https://example.com/metadata/");
    });
  });

  describe("Minting fungible tokens", function () {
    it("Should mint fungible tokens successfully", async function () {
      await carbonCreditERC1155.mintFungibleToken(addr1.address, 100, "0x");
      expect(await carbonCreditERC1155.balanceOf(addr1.address, 1)).to.equal(100);
    });

    it("Should mint fungible tokens only by the owner", async function () {
      await expect(
        carbonCreditERC1155.connect(addr1).mintFungibleToken(addr1.address, 100, "0x")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Minting non-fungible tokens", function () {
    it("Should mint non-fungible tokens successfully", async function () {
      await carbonCreditERC1155.mintNonFungibleToken(addr1.address, "0x");
      expect(await carbonCreditERC1155.balanceOf(addr1.address, 1)).to.equal(1);
    });

    it("Should mint non-fungible tokens only by the owner", async function () {
      await expect(
        carbonCreditERC1155.connect(addr1).mintNonFungibleToken(addr1.address, "0x")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Burning fungible tokens", function () {
    beforeEach(async function () {
      await carbonCreditERC1155.mintFungibleToken(addr1.address, 100, "0x");
    });

    it("Should burn fungible tokens successfully", async function () {
      await carbonCreditERC1155.burn(addr1.address, 1, 50);
      expect(await carbonCreditERC1155.balanceOf(addr1.address, 1)).to.equal(50);
    });

    it("Should burn fungible tokens only by the owner", async function () {
      await expect(
        carbonCreditERC1155.connect(addr1).burn(addr1.address, 1, 50)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Burning non-fungible tokens", function () {
    beforeEach(async function () {
      await carbonCreditERC1155.mintNonFungibleToken(addr1.address, "0x");
    });

    it("Should burn non-fungible tokens successfully", async function () {
      await carbonCreditERC1155.burn(addr1.address, 1, 1);
      expect(await carbonCreditERC1155.balanceOf(addr1.address, 1)).to.equal(0);
    });
    it("Should burn non-fungible tokens only by the owner", async function () {
      await expect(
        carbonCreditERC1155.connect(addr1).burn(addr1.address, 1, 1)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Updating URI", function () {
    it("Should update the URI successfully", async function () {
      await carbonCreditERC1155.setURI("https://newexample.com/metadata/");
      expect(await carbonCreditERC1155.uri(1)).to.equal("https://newexample.com/metadata/");
    }); it("Should update the URI only by the owner", async function () {
      await expect(
        carbonCreditERC1155.connect(addr1).setURI("https://newexample.com/metadata/")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Transferring tokens", function () {
    beforeEach(async function () {
      await carbonCreditERC1155.mintFungibleToken(addr1.address, 100, "0x");
      await carbonCreditERC1155.mintNonFungibleToken(addr1.address, "0x");
    }); it("Should transfer fungible tokens successfully", async function () {
      await carbonCreditERC1155.connect(addr1).safeTransferFrom(addr1.address, addr2.address, 1, 50, "0x");
      expect(await carbonCreditERC1155.balanceOf(addr1.address, 1)).to.equal(50);
      expect(await carbonCreditERC1155.balanceOf(addr2.address, 1)).to.equal(50);
    });

    it("Should transfer non-fungible tokens successfully", async function () {
      await carbonCreditERC1155.connect(addr1).safeTransferFrom(addr1.address, addr2.address, 2, 1, "0x");
      expect(await carbonCreditERC1155.balanceOf(addr1.address, 2)).to.equal(0);
      expect(await carbonCreditERC1155.balanceOf(addr2.address, 2)).to.equal(1);
    });
  });
});      
