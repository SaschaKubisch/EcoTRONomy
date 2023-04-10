const port = process.env.HOST_PORT || 9090
const solc = require('solc');

module.exports = {
  networks: {
    mainnet: {
      // Don't put your private key here:
      privateKey: process.env.PRIVATE_KEY_MAINNET,
      /*
Create a .env file (it must be gitignored) containing something like

  export PRIVATE_KEY_MAINNET=4E7FEC...656243

Then, run the migration with:

  source .env && tronbox migrate --network mainnet

      */
      userFeePercentage: 100,
      feeLimit: 1000 * 1e6,
      fullHost: 'https://api.trongrid.io',
      network_id: '1'
    },
    shasta: {
      privateKey: process.env.PRIVATE_KEY_SHASTA,
      userFeePercentage: 50,
      feeLimit: 1000 * 1e6,
      fullHost: 'https://api.shasta.trongrid.io',
      network_id: '2'
    },
    nile: {
      privateKey: process.env.PRIVATE_KEY_NILE,
      userFeePercentage: 100,
      feeLimit: 1000 * 1e6,
      fullHost: 'https://nile.trongrid.io',
      network_id: '3'
    },
    development: {
      // For tronbox/tre docker image
      from: "TW2Eokv3CTTPQ6qNPyucnkZbNxm4sPH4s8",
      privateKey: 'becdebcb1aea54a9473218831906976d5788e5ba07ecd6a104032e5f2c702b51',
      userFeePercentage: 0,
      feeLimit: 1000 * 1e6,
      fullHost: 'https://nile.trongrid.io',
      network_id: '*'
    },
    compilers: {
      solc: {
        version: '0.8.6', // Replace '0.8.6' with solc
      }
    }
  },
  contracts_directory: './contracts',
  // solc compiler optimize
  solc: {
    version: '0.8.6',
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
