var path = require('path');

var ERC1155Token = artifacts.require(path.join(__dirname, "../contracts/ERC1155Token.sol"));
var Bridge = artifacts.require(path.join(__dirname, "../contracts/Bridge.sol"));
var Marketplace = artifacts.require(path.join(__dirname, "../contracts/Marketplace.sol"));
var Offset = artifacts.require(path.join(__dirname, "../contracts/Offset.sol"));
var Treasury = artifacts.require(path.join(__dirname, "../contracts/Treasury.sol"));
var WrappedBCT = artifacts.require(path.join(__dirname, "../contracts/WrappedBCT.sol"));

module.exports = function(deployer) {
  const uri = "https://example.com/tokens/"; // Replace this with your desired base URI
  deployer.deploy(ERC1155Token, uri)
    .then(() => {
      return deployer.deploy(Bridge, ERC1155Token.address);
    });
  deployer.deploy(Bridge);
  deployer.deploy(Marketplace);
  deployer.deploy(Offset);
  deployer.deploy(Treasury);
  deployer.deploy(WrappedBCT);
};
