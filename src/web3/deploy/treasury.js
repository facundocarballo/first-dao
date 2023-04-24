const Contract = require("../contracts");
const Web3 = require('web3');

// Constants
const RPC = "https://rpc.api.moonbeam.network";

// Set up Web3
const web3 = new Web3(RPC);

const deployTreasury = () => {
    const Treasury = new Contract("Treasury", "../contracts/Treasury.sol", "Treasury.sol");
    Treasury.compile();

    // Set up the contract arguments.
    
};

module.exports = deployTreasury;