const Contract = require("../contracts");
const Web3 = require('web3');

// Constants
const RPC = "https://rpc.api.moonbeam.network";

// Set up Web3
const web3 = new Web3(RPC);

// Deploy ERC20 Votes
const deployERC20Votes = () => {
    const Token = new Contract("Token", "../contracts/Token.sol", "Token.sol");
    Token.compile();
    const initialSupply = web3.utils.toWei('123456789', 'ether');
    const args = ["TokenTest", "TT", initialSupply];
    Token.deploy(args);

    return Token.address;
};

module.exports = deployERC20Votes;
