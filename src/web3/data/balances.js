import { RPC } from '../index.js';
import Web3 from 'web3';

// Set up Web3 Provider
const web3 = new Web3(RPC);

// Define Address to and Address From variables
const addressFrom = "0x9060723c22dE586c2fA5eFa07A7743F6f4a935f5";
const addressTo = "0x0b4e72a8f9920569cA880DA13B88B0210AB5Bf00";

const balances = async () => {
    const balanceFrom = await web3.utils.fromWei(await web3.eth.getBalance(addressFrom), 'ether');
    const balanceTo = await web3.utils.fromWei(await web3.eth.getBalance(addressTo), 'ether');

    console.log(`The balance of ${addressFrom} is: ${balanceFrom} ETH`);
    console.log(`The balance of ${addressTo} is: ${balanceTo} ETH`);
};

balances();

