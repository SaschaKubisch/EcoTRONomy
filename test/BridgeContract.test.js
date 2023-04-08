// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ethers } from 'hardhat';
import { expect } from 'chai';

import { CarbonCreditBridge } from '../contracts/CarbonCreditBridge.sol';
import { WrappedBCT } from '../contracts/WrappedBCT.sol';
import { CarbonCreditERC1155 } from '../contracts/CarbonCreditERC1155.sol';

describe('CarbonCreditBridge', function () {
  let owner;
  let user;
  let carbonCreditBridge;
  let wrappedToken;
  let carbonCreditERC1155;

  before(async function () {
    [owner, user] = await ethers.getSigners();

    // Deploy CarbonCreditERC1155 contract
    carbonCreditERC1155 = await (
      await ethers.getContractFactory('CarbonCreditERC1155')
    ).deploy('https://example.com/{id}.json');

    // Deploy WrappedBCT contract
    wrappedToken = await (
      await ethers.getContractFactory('WrappedBCT')
    ).deploy(
      carbonCreditERC1155.address,
      1
    );

    // Deploy CarbonCreditBridge contract
    carbonCreditBridge = await (
      await ethers.getContractFactory('CarbonCreditBridge')
    ).deploy(carbonCreditERC1155.address);

    // Add WrappedBCT as supported wrapper
    await carbonCreditBridge.addSupportedWrapper(wrappedToken.address);
  });

  it('should wrap tokens', async function () {
    const amount = ethers.BigNumber.from('1000000000000000000'); // 1 BCT

    // Transfer BCT tokens to user
    await wrappedToken.wrappedToken().transfer(user.address, amount);

    // Approve CarbonCreditBridge to transfer BCT tokens
    await wrappedToken.wrappedToken().approve(
      carbonCreditBridge.address,
      amount
    );

    // Wrap BCT tokens
    await carbonCreditBridge.wrapTokens(wrappedToken.address, amount);

    // Check user's balance of WrappedBCT tokens
    expect(await wrappedToken.balanceOf(user.address)).to.equal(amount);

    // Check user's balance of carbon credits
    expect(
      await carbonCreditERC1155.balanceOf(user.address, wrappedToken.tokenId())
    ).to.equal(amount);

    // Check total supply of carbon credits
    expect(
      await carbonCreditERC1155.totalSupply(wrappedToken.tokenId())
    ).to.equal(amount);
  });
});
