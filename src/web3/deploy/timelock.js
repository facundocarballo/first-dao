const Contract = require("../contracts");
const Web3 = require('web3');

// Constants
const RPC = "https://rpc.api.moonbeam.network";

// Set up Web3
const web3 = new Web3(RPC);

const deployTimelock = () => {
    const Timelock = new Contract("Timelock", "../contracts/Timelock.sol", "Timelock.sol");
    Timelock.compile();

    // Set up the arguments for this contract.
    const minDelay = 1; // How long we have to wait for execute a proposal that was passed.
    const proposers = [
        "0x9060723c22dE586c2fA5eFa07A7743F6f4a935f5",
        "0x0b4e72a8f9920569cA880DA13B88B0210AB5Bf00",
        "0x0b4e72a8f9920569cA880DA13B88B0210AB5Bf00",
    ]; // This array contains all the addresses allowed to make a proposal in our DAO.
    const executers = [
        "0x9060723c22dE586c2fA5eFa07A7743F6f4a935f5"
    ]; // This array contains all the addresses allowed to execute all the proposal passed.
    const args = [minDelay, proposers, executers];

    // Deploy Contract.
    Timelock.deploy(args);

    return Timelock.address;
};

module.exports = deployTimelock;