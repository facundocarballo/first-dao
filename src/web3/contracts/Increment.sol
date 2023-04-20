// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract A {
    uint256 public _a;
}

contract Incrementer is A {
    uint256 public number;

    constructor(uint256 _initialNumber) {
        number = _initialNumber;
    }

    function increment(uint256 _value) public {
        number = number + _value;
    }

    function reset() public {
        number = 0;
    }
}