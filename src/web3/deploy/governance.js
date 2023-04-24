const Contract = require("../contracts");
const Web3 = require('web3');

// Constants
const RPC = "https://rpc.api.moonbeam.network";

// Set up Web3
const web3 = new Web3(RPC);

const deployGovernance = (Token, Timelock) => {
    const Governance = new Contract(
        "FacundoCarballoDAO", 
        "../contracts/Governance.sol", 
        "Governance.sol"
    );
    Governance.compile();

    // Set up the contract arguments.
    const quorum = 5; // % of total supply of tokens needed to approve a proposal. (5%)
    const votingDelay = 0; // Amount of blocks to wait to make the proposal active.
    const votingPeriod = 5; // Amount of blocks to allow voters to vote.
    const threshold = 0; // Minimum amount of votes that an account must have to create a proposal.
    const args = [Token, Timelock, quorum, votingDelay, votingPeriod, threshold];

    // Deploy Contract.
    Governance.deploy(args);

    return Governance.address;
};

module.exports = deployGovernance;