// // web3Config.js for INFURA (Testnet & Mainnet)
// import Web3 from "web3";

// const INFURA_API_KEY = "YOUR_INFURA_API_KEY";
// const NETWORK = "mainnet"; // or "rinkeby", "ropsten", "kovan", etc.
// const infuraUrl = `https://${NETWORK}.infura.io/v3/${INFURA_API_KEY}`;
// const provider = new Web3.providers.HttpProvider(infuraUrl);
// const web3 = new Web3(provider);

// export default web3;


// web3Config.js for Ganache (local env)
import Web3 from "web3";

const LOCAL_RPC_URL = "http://localhost:7545"; // Replace with your local blockchain's RPC URL
const provider = new Web3.providers.HttpProvider(LOCAL_RPC_URL);
const web3 = new Web3(provider);

export default web3;
