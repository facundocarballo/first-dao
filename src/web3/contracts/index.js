// Requires
const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');

// Constants
const RPC = "https://data-seed-prebsc-1-s1.binance.org:8545/";
const LANGUAGE = "Solidity";
const UTF8 = "utf8";
const SOURCES = "sources";
const RUNS = 200;
const MAIN_CURRENCY = "BNB";

// Set up Web3
const web3 = new Web3(RPC);

const accountFrom = {
    privateKey: '', // TODO: add private key
    address: '0x9060723c22dE586c2fA5eFa07A7743F6f4a935f5',
};

class Contract {
    constructor(name, path, fileName) {
        this.name = name;
        this.path = path;
        this.fileName = fileName;
    }

    compile() {
        // Get path and load contract
        const source = fs.readFileSync(this.path, UTF8);
        // Create input object
        const input = {
            language: LANGUAGE,
            sources: {},
            settings: {
                optimizer: {
                    enabled: false,
                    runs: RUNS
                },
                outputSelection: {
                    '*': {
                        '*': ['*'],
                    },
                },
            },
        };
        // Put the contract source into the input obj
        let obj = input[SOURCES];
        obj[this.fileName] = { content: source };
        input[SOURCES] = obj;
        // Compile the contract
        const tempFile = JSON.parse(solc.compile(JSON.stringify(input)));
        // Save the contract 
        this.contract = tempFile.contracts[this.fileName][this.name];
    }

    async deploy(args) {
        // Get the bytecode and ABI
        const bytecode = this.contract.evm.bytecode.object;
        const abi = this.contract.abi;

        // Create contract instance
        const contract = new web3.eth.Contract(abi);

        // Create constructor instance
        const tx = contract.deploy({
            data: bytecode,
            arguments: args,
            from: accountFrom.address
        });        
        

        // Sign transaction
        const estimateGas = await tx.estimateGas();
        const createTransaction = await web3.eth.accounts.signTransaction(
            {
                data: tx.encodeABI(),
                gas: estimateGas,
            },
            accountFrom.privateKey
        );

        // Send transaction
        const receipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
        console.log(receipt);
        // Save the contract address
        this.address = receipt.contractAddress;
        // Get the cost of the contract
        const gasUsed_wei = receipt.cumulativeGasUsed;
        const gasPrice_wei = receipt.effectiveGasPrice;
        const gasUsed = web3.utils.fromWei(gasUsed_wei, 'ether');
        const gasPrice = web3.utils.fromWei(gasPrice_wei, 'ether');
        const contractCost = (Number(gasUsed) * Number(gasPrice)).toFixed(4);
        // Print message
        console.log(this.name + " deployed at address: " + this.address);
        console.log("Cost: " + contractCost + MAIN_CURRENCY);
    }

}

module.exports = Contract;