const fs = require('fs');
const solc = require('solc');
import { RPC } from '../index.js';
// const RPC = require('../index.js');
const Web3 = require('web3');

// Set up Web3 Provider
const web3 = new Web3(RPC);

const accountFrom = {
    privateKey: '', // TODO: add private key
    address: '0x9060723c22dE586c2fA5eFa07A7743F6f4a935f5',
};

const LANGUAGE = "Solidity";
const UTF8 = "utf8";
const SOURCES = "sources";
const RUNS = 200;

// Get path and load contract
const source = fs.readFileSync('../contracts/Token.sol', 'utf8');

// Create input object
const input = {
    language: 'Solidity',
    sources: {
        'Token.sol': {
            content: source,
        },
    },
    settings: {
        optimizer: {
            enabled: false,
            runs: 200
        },
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};

const i = {
    language: LANGUAGE,
    sources: {},
    settings: {
        optimizer: {
            enabled: false,
            runs: 200
        },
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};

const fileName = "Token.sol";
let obj = i["sources"];
obj[fileName] = { content: source };
i["sources"] = obj;

// Compile the contract
const tempFile = JSON.parse(solc.compile(JSON.stringify(i)));

console.log(tempFile);

const contractFile = tempFile.contracts['Token.sol']['Token'];

console.log("Contract File: ", contractFile);

// NOTA:
// Para poder compilar un contrato de Solidity utilizando web3 y node js
// Los contratos involucrados deben estar todos en un mismo archivo.

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

    async deploy() {
        // Get the bytecode and ABI
        const bytecode = this.contract.evm.bytecode.object;
        const abi = this.contract.abi;

        // Create contract instance
        const contract = new web3.eth.Contract(abi);
        
        // Create constructor instance
        const tx = contract.deploy({
            data: bytecode,
            arguments: [5]
        });

        // Sign transaction
        const createTransaction = await web3.eth.accounts.signTransaction(
            {
                data: tx.encodeABI(),
                gas: await tx.estimateGas()
            },
            accountFrom.privateKey
        );

        // Send transaction
        const receipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
        
        // Save the contract address
        this.address = receipt.contractAddress;

        // Print message
        console.log(this.name + "Deployed at address: " + this.address);
    }

}
