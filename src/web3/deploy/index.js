const Contract = require("../contracts");
const Web3 = require('web3');
const deployERC20Votes = require("./token");
const deployTimelock = require("./timelock");
const deployGovernance = require("./governance");
const deployTreasury = require("./treasury");

// Constants
const RPC = "https://rpc.api.moonbeam.network";

// Set up Web3
const web3 = new Web3(RPC);

// Deploy ERC20 Votes.
const Token = deployERC20Votes();

// Deploy Timelock.
const Timelock = deployTimelock();

// Deploy Governance.
const Governance = deployGovernance(Token, Timelock);

// Deploy Treasury.
const Treasury = deployTreasury();
