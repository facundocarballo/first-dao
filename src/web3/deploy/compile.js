import fs from "fs";
import solc from "solc";

// Get path and load contract
const source = fs.readFileSync('../contracts/contracts.sol', 'utf8');

// Create input object
const input = {
    language: 'Solidity',
    sources: {
        'contracts.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};

// Compile the contract
const tempFile = JSON.parse(solc.compile(JSON.stringify(input)));

const contractFile = tempFile.contracts['contracts.sol']['Token'];

console.log("Contract File: ", contractFile);

// NOTA:
// Para poder compilar un contrato de Solidity utilizando web3 y node js
// Los contratos involucrados deben estar todos en un mismo archivo.