import fs from "fs";
import solc from "solc";

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

// Compile the contract
const tempFile = JSON.parse(solc.compile(JSON.stringify(input)));

console.log(tempFile);

// const contractFile = tempFile.contracts['Governance.sol']['FacundoCarballoDAO'];

console.log("Contract File: ", contractFile);

// NOTA:
// Para poder compilar un contrato de Solidity utilizando web3 y node js
// Los contratos involucrados deben estar todos en un mismo archivo.
