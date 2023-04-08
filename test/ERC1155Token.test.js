const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CarbonCreditERC1155", function () {
    let CarbonCreditERC1155;
    let carbonCreditERC1155;
    let owner, addr1, addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        CarbonCreditERC1155 = await ethers.getContractFactory("CarbonCreditERC1155");
        carbonCreditERC1155 = await CarbonCreditERC1155.deploy("https://api.example.com/tokens/");
        await carbonCreditERC1155.deployed();
    });

    describe("Deployment", function () {
        it("Should set the correct URI", async function () {
            expect(await carbonCreditERC1155.uri(0)).to.equal("https://api.example.com/tokens/");
        });
    });

    describe("Minting tokens", function () {
        it("Should mint fungible tokens successfully", async function () {
            const tokenId = 1;
            const amount = 100;
            await carbonCreditERC1155.connect(owner).mintFungibleToken(addr1.address, amount, "0x");
            expect(await carbonCreditERC1155.balanceOf(addr1.address, tokenId)).to.equal(amount);
        });

        it("Should mint non-fungible tokens successfully", async function () {
            const tokenId = 1;
            await carbonCreditERC1155.connect(owner).mintNonFungibleToken(addr1.address, "0x");
            expect(await carbonCreditERC1155.balanceOf(addr1.address, tokenId)).to.equal(1);
        });

        it("Should only allow owner or the contract to mint tokens", async function () {
            const amount = 100;
            const tokenId = 1;
            await expect(carbonCreditERC1155.connect(addr1).mint(addr1.address, tokenId, amount, "0x")).to.be.revertedWith("CarbonCreditERC1155: Only owner or the contract itself can mint tokens");
        });
    });

    describe("Burning tokens", function () {
        it("Should burn tokens successfully", async function () {
            const tokenId = 1;
            const amount = 100;
            await carbonCreditERC1155.connect(owner).mintFungibleToken(addr1.address, amount, "0x");
            expect(await carbonCreditERC1155.balanceOf(addr1.address, tokenId)).to.equal(amount);

            await carbonCreditERC1155.connect(owner).burn(addr1.address, tokenId, amount);
            expect(await carbonCreditERC1155.balanceOf(addr1.address, tokenId)).to.equal(0);
        });

        it("Should only allow owner to burn tokens", async function () {
            const tokenId = 1;
            const amount = 100;
            await carbonCreditERC1155.connect(owner).mintFungibleToken(addr1.address, amount, "0x");
            expect(await carbonCreditERC1155.balanceOf(addr1.address, tokenId)).to.equal(amount);

            await expect(carbonCreditERC1155.connect(addr1).burn(addr1.address, tokenId, amount)).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    describe("Setting URI", function () {
        it("Should set the URI successfully", async function () {
            const newURI = "https://api.example.com/newtokens/";
            await carbonCreditERC1155.connect(owner).setURI(newURI);
            expect(await carbonCreditERC1155.uri(0)).to.equal(newURI);
        });

        it("Should only allow owner to set the URI", async function () {
            const newURI = "https://api.example.com/newtokens/";
            await expect(carbonCreditERC1155.connect(addr1).setURI(newURI)).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });
});