// Requires
const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');

// Constants
const RPC = "https://rpc.api.moonbeam.network";
const LANGUAGE = "Solidity";
const UTF8 = "utf8";
const SOURCES = "sources";
const RUNS = 200;

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
        console.log("Contract instance created...");
        // Create constructor instance
        const tx = contract.deploy({
            data: bytecode,
            arguments: args
        });
        console.log("Contract Deploy created...");
        let estimateGas = web3.utils.toWei('0.06', 'ether');
        try {
            estimateGas = await tx.estimateGas();
            console.log("Estimate Gas: ", estimateGas);
        } catch (err) {
            console.log("ERROR: ", err);
        }
        // Sign transaction
        const createTransaction = await web3.eth.accounts.signTransaction(
            {
                data: tx.encodeABI(),
                gas: estimateGas,
                gasLimit: web3.utils.toHex(web3.utils.toWei('10', 'ether')),
            },
            accountFrom.privateKey
        );
        console.log("Contract Sign created...");

        // Send transaction
        const receipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
        console.log("Contract Send created...");

        // Save the contract address
        this.address = receipt.contractAddress;

        // Print message
        console.log(this.name + " deployed at address: " + this.address);
    }

}

module.exports = Contract;